import { MIN_OPTIONS } from './examState';

// Returns an error message string, or '' if the exam state is valid.
export function validateExamState(value) {
  const { title, examCode, questions, passingScore, availableDate, availableFrom, availableTo } = value;

  if (!title.trim()) return 'Exam title is required.';
  if (!examCode.trim()) return 'Exam code is required.';
  if (questions.length === 0) return 'Add at least one question.';
  if (passingScore !== '' && Number(passingScore) > questions.length) {
    return `Passing score can't exceed the number of questions (${questions.length}).`;
  }
  if (!availableDate) return 'Available date is required.';
  if (!availableFrom) return 'Available from time is required.';
  if (!availableTo) return 'Available to time is required.';
  if (availableFrom >= availableTo) return 'Available "to" time must be after "from" time.';

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.text.trim()) return `Question ${i + 1}: question text is required.`;
    if (q.options.length < MIN_OPTIONS) {
      return `Question ${i + 1}: at least ${MIN_OPTIONS} options are required.`;
    }
    if (q.options.some((o) => !o.text.trim())) return `Question ${i + 1}: all options must be filled in.`;
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      return `Question ${i + 1}: select a correct answer.`;
    }
  }

  return '';
}