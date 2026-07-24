import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { generateCode } from '../lib/codeGenerator';
import { newId, emptyQuestion, flattenExamState, moveQuestion, MIN_OPTIONS } from '../lib/examState';
import { validateExamState } from '../lib/validateExamState';
import AutoGrowTextarea from './AutoGrowTextarea';
import FormSection from './FormSection';
import QuestionEditor from './QuestionEditor';
import Button from '../../../components/ui/Button';
import styles from './ExamForm.module.css';

// value: the shared exam state (see lib/examState.js)
// onChange: (nextValue) => void — called on every edit
// onSubmit: (flattenedPayload) => void — called on valid submit
export default function ExamForm({ value, onChange, onSubmit, submitLabel = 'Save Exam', loading, serverError }) {
  const [error, setError] = useState('');
  const {
    title,
    description,
    timeLimitMinutes,
    passingScore,
    examCode,
    availableDate,
    availableFrom,
    availableTo,
    questions,
  } = value;

  function patch(fields) {
    onChange({ ...value, ...fields });
  }

  function handleGenCode() {
    patch({ examCode: generateCode() });
  }

  function addQuestion() {
    patch({ questions: [...questions, emptyQuestion()] });
  }

  function removeQuestion(idx) {
    patch({ questions: questions.filter((_, i) => i !== idx) });
  }

  function moveQuestionUpDown(idx, direction) {
    patch({ questions: moveQuestion(questions, idx, direction) });
  }

  function updateQuestion(idx, field, val) {
    patch({ questions: questions.map((q, i) => (i === idx ? { ...q, [field]: val } : q)) });
  }

  function addOption(qIdx) {
    patch({
      questions: questions.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, { id: newId('opt'), text: '' }] } : q,
      ),
    });
  }

  function removeOption(qIdx, optId) {
    patch({
      questions: questions.map((q, i) => {
        if (i !== qIdx) return q;
        if (q.options.length <= MIN_OPTIONS) return q;
        const removedIdx = q.options.findIndex((o) => o.id === optId);
        if (removedIdx === -1) return q;
        const options = q.options.filter((o) => o.id !== optId);
        let correctAnswer = q.correctAnswer;
        if (removedIdx === q.correctAnswer) correctAnswer = 0;
        else if (removedIdx < q.correctAnswer) correctAnswer = q.correctAnswer - 1;
        return { ...q, options, correctAnswer };
      }),
    });
  }

  function updateOption(qIdx, optId, val) {
    patch({
      questions: questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o) => (o.id === optId ? { ...o, text: val } : o)) }
          : q,
      ),
    });
  }

  function setCorrectAnswer(qIdx, optIdx) {
    updateQuestion(qIdx, 'correctAnswer', optIdx);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateExamState(value);
    setError(validationError);
    if (validationError) return;
    onSubmit(flattenExamState(value));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.errorText}>{error}</p>}
      {!error && serverError && <p className={styles.errorText}>{serverError}</p>}

      <FormSection label="Exam Details">
        <div className={styles.stack}>
          <input
            type="text"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => patch({ title: e.target.value })}
            className={styles.input}
          />
          <AutoGrowTextarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => patch({ description: e.target.value })}
            className={styles.input}
          />
        </div>
      </FormSection>

      <FormSection
        label="Exam Code"
        description="Students use this to enter the exam. Edit or generate a random one."
      >
        <div className={styles.codeRow}>
          <input
            type="text"
            value={examCode}
            onChange={(e) => patch({ examCode: e.target.value.toUpperCase().slice(0, 6) })}
            maxLength={6}
            className={styles.codeInput}
          />
          <button type="button" onClick={handleGenCode} className={styles.generateBtn}>
            <RefreshCw size={14} className={styles.generateIcon} />
            Generate
          </button>
        </div>
      </FormSection>

      <FormSection label="Settings">
        <div className={styles.settingsGrid}>
          <div>
            <label className={styles.fieldLabel}>Time Limit (minutes)</label>
            <input
              type="number"
              min={1}
              max={300}
              value={timeLimitMinutes}
              onChange={(e) => patch({ timeLimitMinutes: e.target.value })}
              className={styles.input}
            />
          </div>
          <div>
            <label className={styles.fieldLabel}>Passing Score</label>
            <input
              type="number"
              min={0}
              max={questions.length}
              placeholder={`e.g. ${Math.ceil(questions.length / 2) || 1}`}
              value={passingScore}
              onChange={(e) => patch({ passingScore: e.target.value })}
              className={styles.input}
            />
            <p className={styles.fieldHint}>
              Number of correct answers needed to pass, out of {questions.length} question
              {questions.length === 1 ? '' : 's'}.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection label="Availability">
        <div className={styles.availabilityGrid}>
          <div>
            <label className={styles.fieldLabel}>Date</label>
            <input
              type="date"
              required
              value={availableDate}
              onChange={(e) => patch({ availableDate: e.target.value })}
              className={styles.input}
            />
          </div>
          <div>
            <label className={styles.fieldLabel}>From</label>
            <input
              type="time"
              required
              value={availableFrom}
              onChange={(e) => patch({ availableFrom: e.target.value })}
              className={styles.input}
            />
          </div>
          <div>
            <label className={styles.fieldLabel}>To</label>
            <input
              type="time"
              required
              value={availableTo}
              onChange={(e) => patch({ availableTo: e.target.value })}
              className={styles.input}
            />
          </div>
        </div>
      </FormSection>

      <FormSection label={`Questions (${questions.length})`}>
        <div className={styles.questionList}>
          {questions.map((q, idx) => (
            <QuestionEditor
              key={q.id}
              question={q}
              index={idx}
              isFirst={idx === 0}
              isLast={idx === questions.length - 1}
              isLastInList={idx === questions.length - 1}
              delay={idx * 40}
              onChangeText={(val) => updateQuestion(idx, 'text', val)}
              onMoveUp={() => moveQuestionUpDown(idx, -1)}
              onMoveDown={() => moveQuestionUpDown(idx, 1)}
              onRemove={() => removeQuestion(idx)}
              onAddOption={() => addOption(idx)}
              onChangeOption={(optId, val) => updateOption(idx, optId, val)}
              onRemoveOption={(optId) => removeOption(idx, optId)}
              onSetCorrect={(optIdx) => setCorrectAnswer(idx, optIdx)}
            />
          ))}
        </div>

        <button type="button" onClick={addQuestion} className={styles.addQuestionBtn}>
          + Add Question
        </button>
      </FormSection>

      <Button type="submit" size="lg" disabled={loading} className={styles.submitBtn} uppercase>
        {loading ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}