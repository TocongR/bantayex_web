import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getExamStatus } from './lib/examStatus';
import { ArrowLeft, Pencil, Users, Clock, Hash, Calendar } from 'lucide-react';
import Eyebrow from '../../components/ui/Eyebrow';
import StatusBadge from './components/StatusBadge';
import MetaItem from './components/MetaItem';
import QuestionReadout from './components/QuestionReadout';
import styles from './ExamDetailPage.module.css';

export default function ExamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, 'exams', id)).then((snap) => {
      if (snap.exists()) setExam({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className={styles.centerNote}>Loading...</div>;
  }
  if (!exam) {
    return <div className={styles.centerNote}>Exam not found.</div>;
  }

  const status = getExamStatus(exam);
  const canEdit = status.label !== 'ACTIVE';
  const questionCount = exam.questions?.length || 0;

  return (
    <div className={styles.page}>
      <button onClick={() => navigate('/exams')} className={styles.backBtn}>
        <ArrowLeft size={14} />
        Exams
      </button>

      <div className={styles.header}>
        <div>
          <Eyebrow>Exam</Eyebrow>
          <h2 className={styles.title}>{exam.title}</h2>
        </div>
        <StatusBadge label={status.label} />
      </div>
      {exam.description && <p className={styles.description}>{exam.description}</p>}

      <div className={styles.actions}>
        {canEdit && (
          <button onClick={() => navigate(`/exams/${id}/edit`)} className={styles.editBtn}>
            <Pencil size={14} />
            Edit Exam
          </button>
        )}
        <button onClick={() => navigate(`/exams/${id}/results`)} className={styles.resultsBtn}>
          <Users size={14} />
          View Results
        </button>
      </div>

      <div className={styles.metaGrid}>
        <MetaItem icon={<Hash size={13} />} label="Code" value={exam.examCode} mono />
        <MetaItem icon={<Clock size={13} />} label="Time Limit" value={`${exam.timeLimitMinutes} min`} />
        <MetaItem icon={<Hash size={13} />} label="Passing Score" value={`${exam.passingScore}/${questionCount}`} />
        <MetaItem
          icon={<Calendar size={13} />}
          label="Available"
          value={
            exam.availableDate
              ? `${exam.availableDate}${exam.availableFrom ? ` · ${exam.availableFrom}–${exam.availableTo}` : ''}`
              : 'Always'
          }
        />
      </div>

      <Eyebrow>Questions ({questionCount})</Eyebrow>
      <div className={styles.questionList}>
        {(exam.questions || []).map((q, idx) => (
          <QuestionReadout key={q.id || idx} question={q} index={idx} isLast={idx === questionCount - 1} />
        ))}
      </div>
    </div>
  );
}