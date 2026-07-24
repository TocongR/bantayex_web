import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getExamStatus } from '../features/exams/lib/examStatus';
import ExamRow from '../features/exams/components/ExamRow';
import Eyebrow from '../components/ui/Eyebrow';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { Plus, ChevronRight, FileText, Users, CheckCircle2, Clock } from 'lucide-react';
import styles from './DashboardPage.module.css';

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState({ total: 0, passed: 0 });

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

  useEffect(() => {
    async function loadAttempts() {
      const codes = exams.map((e) => e.examCode).filter(Boolean);
      if (codes.length === 0) {
        setAttempts({ total: 0, passed: 0 });
        return;
      }
      // examId is unreliable on result docs (see results page note), so we
      // fetch by examCode in batches of 10 (Firestore 'in' query limit).
      const batches = chunk(codes, 10);
      const snaps = await Promise.all(
        batches.map((batch) =>
          getDocs(query(collection(db, 'results'), where('examCode', 'in', batch))),
        ),
      );
      let total = 0,
        passed = 0;
      snaps.forEach((snap) =>
        snap.docs.forEach((d) => {
          total += 1;
          if (d.data().passed) passed += 1;
        }),
      );
      setAttempts({ total, passed });
    }
    if (exams.length) loadAttempts();
    else setAttempts({ total: 0, passed: 0 });
  }, [exams]);

  const active = exams.filter((e) => getExamStatus(e).label === 'ACTIVE').length;
  const upcoming = exams.filter((e) => getExamStatus(e).label === 'UPCOMING').length;
  const passRate = attempts.total ? Math.round((attempts.passed / attempts.total) * 100) : 0;
  const recent = exams.slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Eyebrow>Dashboard</Eyebrow>
          <h2 className={styles.title}>
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </h2>
        </div>
        <button onClick={() => navigate('/exams/create')} className={styles.newExamBtn}>
          <Plus size={16} />
          New Exam
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <>
          <div className={styles.statGrid}>
            <StatCard icon={<FileText size={16} />} label="Total Exams" value={exams.length} />
            <StatCard
              icon={<Clock size={16} />}
              label="Active / Upcoming"
              value={`${active} / ${upcoming}`}
            />
            <StatCard icon={<Users size={16} />} label="Total Attempts" value={attempts.total} />
            <StatCard icon={<CheckCircle2 size={16} />} label="Pass Rate" value={`${passRate}%`} />
          </div>

          {exams.length === 0 ? (
            <EmptyState
              message="No exams yet. Create your first one!"
              actionLabel="Create Exam"
              onAction={() => navigate('/exams/create')}
            />
          ) : (
            <>
              <div className={styles.recentHeader}>
                <Eyebrow>Recent Exams</Eyebrow>
                <button onClick={() => navigate('/exams')} className={styles.viewAllBtn}>
                  View all
                  <ChevronRight size={14} />
                </button>
              </div>

              <div>
                {recent.map((exam, i) => (
                  <ExamRow
                    key={exam.id}
                    exam={exam}
                    onClick={() => navigate(`/exams/${exam.id}`)}
                    showDivider={i < recent.length - 1}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}