// Determine exam status based on availableDate / availableFrom / availableTo
export function getExamStatus(exam) {
  if (!exam.availableDate) return { label: 'ACTIVE' };

  const now = new Date();
  const start = new Date(`${exam.availableDate}T${exam.availableFrom || '00:00'}`);
  const end = new Date(`${exam.availableDate}T${exam.availableTo || '23:59'}`);

  if (now < start) return { label: 'UPCOMING' };
  if (now > end) return { label: 'EXPIRED' };
  return { label: 'ACTIVE' };
}