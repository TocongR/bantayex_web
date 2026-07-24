import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Search } from 'lucide-react';
import Eyebrow from '../../components/ui/Eyebrow';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ExamListItem from './components/ExamListItem';
import styles from './ExamsListPage.module.css';

export default function ExamsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'exams'), where('professorId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setExams(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const filtered = exams.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.examCode?.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(id) {
    await deleteDoc(doc(db, 'exams', id));
    setDeleteTarget(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Eyebrow>Exams</Eyebrow>
          <h2 className={styles.title}>My Exams</h2>
          <p className={styles.subtitle}>
            {exams.length} exam{exams.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <button onClick={() => navigate('/exams/create')} className={styles.newExamBtn}>
          <Plus size={16} />
          New Exam
        </button>
      </div>

      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by title or exam code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.divider} />

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'No exams match your search.' : 'No exams yet. Create your first one!'}
          actionLabel={search ? null : 'Create Exam'}
          onAction={() => navigate('/exams/create')}
        />
      ) : (
        <div>
          {filtered.map((exam, i) => (
            <ExamListItem
              key={exam.id}
              exam={exam}
              onOpen={() => navigate(`/exams/${exam.id}`)}
              onEdit={() => navigate(`/exams/${exam.id}/edit`)}
              onResults={() => navigate(`/exams/${exam.id}/results`)}
              onDeleteRequest={() => setDeleteTarget(exam)}
              showDivider={i < filtered.length - 1}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete exam?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}