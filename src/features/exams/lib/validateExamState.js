import { MIN_OPTIONS } from './examState';

// Returns { message, fieldId } for the first failure, or null if the exam state is valid.
// fieldId points at the input/section that should receive focus so the user can fix it.
export function validateExamState(value) {
  const { title, examCode, questions, passingScore, availableDate, availableFrom, availableTo } = value;

  if (!title.trim()) return { message: 'Exam title is required.', fieldId: 'exam-title' };
  if (!examCode.trim()) return { message: 'Exam code is required.', fieldId: 'exam-code' };
  if (questions.length === 0) {
    return { message: 'Add at least one question.', fieldId: 'add-question' };
  }
  if (passingScore !== '' && Number(passingScore) > questions.length) {
    return {
      message: `Passing score can't exceed the number of questions (${questions.length}).`,
      fieldId: 'passing-score',
    };
  }
  if (!availableDate) {
    return { message: 'Available date is required.', fieldId: 'exam-date' };
  }
  if (!availableFrom) {
    return { message: 'Available from time is required.', fieldId: 'exam-from' };
  }
  if (!availableTo) {
    return { message: 'Available to time is required.', fieldId: 'exam-to' };
  }
  if (availableFrom >= availableTo) {
    return {
      message: 'Available "to" time must be after "from" time.',
      fieldId: 'exam-to',
    };
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const fieldId = `question-${i}`;
    if (!q.text.trim()) {
      return { message: `Question ${i + 1}: question text is required.`, fieldId };
    }
    if (q.options.length < MIN_OPTIONS) {
      return {
        message: `Question ${i + 1}: at least ${MIN_OPTIONS} options are required.`,
        fieldId,
      };
    }
    if (q.options.some((o) => !o.text.trim())) {
      return { message: `Question ${i + 1}: all options must be filled in.`, fieldId };
    }
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      return { message: `Question ${i + 1}: select a correct answer.`, fieldId };
    }
  }

  return null;
}
