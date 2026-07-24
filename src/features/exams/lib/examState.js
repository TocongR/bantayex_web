import { generateCode } from './codeGenerator';

let uidCounter = 0;
export function newId(prefix) {
  uidCounter += 1;
  return `${prefix}${Date.now()}_${uidCounter}`;
}

export const MIN_OPTIONS = 2;

export function emptyQuestion() {
  return {
    id: newId('q'),
    text: '',
    options: [
      { id: newId('opt'), text: '' },
      { id: newId('opt'), text: '' },
    ],
    correctAnswer: 0,
  };
}

// Accepts a question in either the legacy { optionA..D, correctAnswer: 'A' }
// shape, a plain-string options[] shape, or the current { id, text }[] shape,
// and normalizes it to the current shape.
export function normalizeQuestion(q) {
  if (Array.isArray(q.options)) {
    const options = q.options.map((o) =>
      typeof o === 'string'
        ? { id: newId('opt'), text: o }
        : { id: o.id || newId('opt'), text: o.text || '' },
    );
    return {
      id: q.id || newId('q'),
      text: q.text || '',
      options: options.length
        ? options
        : [
            { id: newId('opt'), text: '' },
            { id: newId('opt'), text: '' },
          ],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    };
  }
  const letters = ['A', 'B', 'C', 'D'];
  const options = letters
    .filter((l) => q[`option${l}`] !== undefined)
    .map((l) => ({ id: newId('opt'), text: q[`option${l}`] }));
  const correctIndex = letters.indexOf(q.correctAnswer);
  return {
    id: q.id || newId('q'),
    text: q.text || '',
    options: options.length
      ? options
      : [
          { id: newId('opt'), text: '' },
          { id: newId('opt'), text: '' },
        ],
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
  };
}

export function emptyExamState(seed = {}) {
  return {
    title: seed.title || '',
    description: seed.description || '',
    timeLimitMinutes: seed.timeLimitMinutes || 30,
    passingScore: seed.passingScore !== undefined ? seed.passingScore : '',
    examCode: seed.examCode || generateCode(),
    availableDate: seed.availableDate || '',
    availableFrom: seed.availableFrom || '',
    availableTo: seed.availableTo || '',
    questions: seed.questions?.length ? seed.questions.map(normalizeQuestion) : [emptyQuestion()],
  };
}

// Converts internal state (option objects with ids) to the plain shape
// used for Firestore storage / onSubmit.
export function flattenExamState(state) {
  return {
    title: state.title.trim(),
    description: state.description.trim(),
    timeLimitMinutes: Number(state.timeLimitMinutes),
    passingScore: state.passingScore === '' ? 0 : Number(state.passingScore),
    examCode: state.examCode.trim().toUpperCase(),
    availableDate: state.availableDate,
    availableFrom: state.availableFrom,
    availableTo: state.availableTo,
    questions: state.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options.map((o) => o.text),
      correctAnswer: q.correctAnswer,
    })),
  };
}

export function optionLabel(idx) {
  let n = idx;
  let label = '';
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

// A compact, id-aware snapshot of the current exam — this is what gets sent
// to the AI so it can reference existing question ids for update/remove.
export function summarizeForAI(state) {
  return {
    title: state.title,
    description: state.description,
    timeLimitMinutes: state.timeLimitMinutes,
    passingScore: state.passingScore,
    examCode: state.examCode,
    availableDate: state.availableDate,
    availableFrom: state.availableFrom,
    availableTo: state.availableTo,
    questions: state.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options.map((o) => o.text),
      correctAnswer: q.correctAnswer,
    })),
  };
}

const TOP_LEVEL_FIELDS = [
  'title',
  'description',
  'timeLimitMinutes',
  'passingScore',
  'examCode',
  'availableDate',
  'availableFrom',
  'availableTo',
];

const DATE_FIELDS = new Set(['availableDate']);
const TIME_FIELDS = new Set(['availableFrom', 'availableTo']);

// Native <input type="date">/<input type="time"> only render a value if it's
// EXACTLY "YYYY-MM-DD" / "HH:MM". The AI won't always return that shape
// (e.g. "August 1, 2026", "3pm") even when told to, so we coerce common
// formats here rather than silently dropping the value into an input that
// can't display it — which is what "the date field doesn't work" looks like.
function coerceDate(value) {
  if (typeof value !== 'string') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return null;
}

function coerceTime(value) {
  if (typeof value !== 'string') return null;
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// Applies an AI-proposed patch (see AIExamAssistant's system prompt for the
// shape) onto the current state, returning a brand new state object.
// Never mutates `state`.
export function applyPatch(state, patch) {
  const next = { ...state };

  if (patch?.set && typeof patch.set === 'object') {
    for (const key of TOP_LEVEL_FIELDS) {
      if (patch.set[key] === undefined) continue;
      if (DATE_FIELDS.has(key)) {
        const coerced = coerceDate(patch.set[key]);
        if (coerced) next[key] = coerced;
        else console.warn(`AI returned an unparseable date for ${key}:`, patch.set[key]);
        continue;
      }
      if (TIME_FIELDS.has(key)) {
        const coerced = coerceTime(patch.set[key]);
        if (coerced) next[key] = coerced;
        else console.warn(`AI returned an unparseable time for ${key}:`, patch.set[key]);
        continue;
      }
      next[key] = patch.set[key];
    }
  }

  let questions = state.questions;

  if (Array.isArray(patch?.questions?.remove) && patch.questions.remove.length) {
    const removeSet = new Set(patch.questions.remove);
    questions = questions.filter((q) => !removeSet.has(q.id));
  }

  if (Array.isArray(patch?.questions?.update) && patch.questions.update.length) {
    questions = questions.map((q) => {
      const upd = patch.questions.update.find((u) => u.id === q.id);
      if (!upd) return q;
      return {
        ...q,
        text: upd.text !== undefined ? upd.text : q.text,
        options:
          Array.isArray(upd.options) && upd.options.length >= MIN_OPTIONS
            ? upd.options.map((text, i) => ({ id: q.options[i]?.id || newId('opt'), text }))
            : q.options,
        correctAnswer: typeof upd.correctAnswer === 'number' ? upd.correctAnswer : q.correctAnswer,
      };
    });
  }

  if (Array.isArray(patch?.questions?.add) && patch.questions.add.length) {
    const added = patch.questions.add.map((q) => ({
      id: newId('q'),
      text: q.text || '',
      options: (Array.isArray(q.options) && q.options.length >= MIN_OPTIONS ? q.options : ['', '']).map(
        (text) => ({ id: newId('opt'), text }),
      ),
      correctAnswer: Number.isInteger(q.correctAnswer) ? q.correctAnswer : 0,
    }));
    questions = [...questions, ...added];
  }

  if (Array.isArray(patch?.questions?.reorder) && patch.questions.reorder.length) {
    const order = patch.questions.reorder;
    const byId = new Map(questions.map((q) => [q.id, q]));
    const reordered = order.map((id) => byId.get(id)).filter(Boolean);
    // Anything not mentioned (e.g. the AI omitted an id) keeps its relative
    // position at the end, rather than silently vanishing.
    const mentioned = new Set(reordered.map((q) => q.id));
    const leftover = questions.filter((q) => !mentioned.has(q.id));
    questions = [...reordered, ...leftover];
  }

  next.questions = questions;
  return next;
}

// Swap a question at `fromIdx` with the one at `fromIdx + direction`
// (direction: -1 to move up, 1 to move down). Used by manual reorder controls.
export function moveQuestion(questions, fromIdx, direction) {
  const toIdx = fromIdx + direction;
  if (toIdx < 0 || toIdx >= questions.length) return questions;
  const next = [...questions];
  [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
  return next;
}

// Human-readable bullet list describing a patch, shown in the confirm card.
export function describePatch(patch) {
  const lines = [];
  if (patch?.set && Object.keys(patch.set).length) {
    for (const [key, value] of Object.entries(patch.set)) {
      lines.push(`~ ${fieldLabel(key)} → ${value}`);
    }
  }
  if (patch?.questions?.add?.length) {
    lines.push(`+ ${patch.questions.add.length} question(s) added`);
  }
  if (patch?.questions?.update?.length) {
    lines.push(`~ ${patch.questions.update.length} question(s) edited`);
  }
  if (patch?.questions?.remove?.length) {
    lines.push(`- ${patch.questions.remove.length} question(s) removed`);
  }
  return lines;
}

export function fieldLabel(key) {
  const map = {
    title: 'Title',
    description: 'Description',
    timeLimitMinutes: 'Time limit',
    passingScore: 'Passing score',
    examCode: 'Exam code',
    availableDate: 'Available date',
    availableFrom: 'Available from',
    availableTo: 'Available to',
  };
  return map[key] || key;
}