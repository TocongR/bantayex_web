import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import ExamForm from './components/ExamForm';
import ExamEditorLayout from './components/ExamEditorLayout';
import { emptyExamState } from './lib/examState';
import { isExamCodeTaken } from './lib/examCodes';

export default function CreateExamPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [examState, setExamState] = useState(() => emptyExamState());

  async function handleSubmit(data) {
    setServerError('');
    setLoading(true);
    try {
      if (await isExamCodeTaken(data.examCode)) {
        setServerError(
          `Exam code "${data.examCode}" is already in use — generate a new one and try again.`,
        );
        setLoading(false);
        return;
      }
      await addDoc(collection(db, 'exams'), {
        ...data,
        professorId: user.uid,
        createdAt: Date.now(),
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save exam. Please try again.');
    }
    setLoading(false);
  }

  return (
    <ExamEditorLayout
      title="Create New Exam"
      backLabel="Dashboard"
      onBack={() => navigate('/dashboard')}
      examState={examState}
      onChangeExamState={setExamState}
    >
      <ExamForm
        value={examState}
        onChange={setExamState}
        onSubmit={handleSubmit}
        submitLabel="Create Exam"
        loading={loading}
        serverError={serverError}
      />
    </ExamEditorLayout>
  );
}