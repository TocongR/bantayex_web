import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ExamForm from './components/ExamForm';
import ExamEditorLayout from './components/ExamEditorLayout';
import { emptyExamState } from './lib/examState';
import { isExamCodeTaken } from './lib/examCodes';

export default function EditExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examState, setExamState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'exams', id)).then((snap) => {
      if (snap.exists()) setExamState(emptyExamState(snap.data()));
      setFetching(false);
    });
  }, [id]);

  async function handleSubmit(data) {
    setServerError('');
    setLoading(true);
    try {
      if (await isExamCodeTaken(data.examCode, { excludeId: id })) {
        setServerError(
          `Exam code "${data.examCode}" is already used by another exam — generate a new one and try again.`,
        );
        setLoading(false);
        return;
      }
      await updateDoc(doc(db, 'exams', id), data);
      navigate(`/exams/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update exam. Please try again.');
    }
    setLoading(false);
  }

  if (fetching) {
    return <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280', fontSize: 14 }}>Loading...</div>;
  }

  if (!examState) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280', fontSize: 14 }}>
        Exam not found.
      </div>
    );
  }

  return (
    <ExamEditorLayout
      title="Edit Exam"
      backLabel="Back to Exam"
      onBack={() => navigate(`/exams/${id}`)}
      examState={examState}
      onChangeExamState={setExamState}
    >
      <ExamForm
        value={examState}
        onChange={setExamState}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
        serverError={serverError}
      />
    </ExamEditorLayout>
  );
}