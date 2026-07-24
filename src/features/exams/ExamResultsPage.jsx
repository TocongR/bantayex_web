import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft } from 'lucide-react';
import Eyebrow from '../../components/ui/Eyebrow';
import StatCard from '../../components/ui/StatCard';
import ResultRow from './components/ResultRow';
import styles from './ExamResultsPage.module.css';

export default function ExamResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError('');
      try {
        const examSnap = await getDoc(doc(db, 'exams', id));
        const examData = examSnap.exists() ? { id: examSnap.id, ...examSnap.data() } : null;
        if (cancelled) return;
        setExam(examData);

        let resultDocs = [];
        if (examData?.examCode) {
          // Note: result docs in this app currently save `examId` as an empty
          // string, so we can't join on it. `examCode` is reliably populated,
          // so we match on that instead. If `examId` gets fixed upstream
          // (wherever results are written), switch this to where('examId', '==', id).
          const q = query(collection(db, 'results'), where('examCode', '==', examData.examCode));
          const snap = await getDocs(q);
          resultDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
        resultDocs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        if (!cancelled) setResults(resultDocs);
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoadError('Failed to load results. Please try again.');
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const attempts = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const passRate = attempts ? Math.round((passedCount / attempts) * 100) : 0;
  const avgScore = attempts ? (results.reduce((sum, r) => sum + (r.score || 0), 0) / attempts).toFixed(1) : '0';

  return (
    <div className={styles.page}>
      <button onClick={() => navigate(`/exams/${id}`)} className={styles.backBtn}>
        <ArrowLeft size={14} />
        Back to Exam
      </button>

      <Eyebrow>Results</Eyebrow>
      <h2 className={styles.title}>{exam?.title || 'Student results'}</h2>
      {exam?.examCode && <p className={styles.codeLine}>Code {exam.examCode}</p>}

      {loading ? (
        <div className={styles.centerNote}>Loading results...</div>
      ) : loadError ? (
        <div className={styles.errorBox}>{loadError}</div>
      ) : (
        <>
          <div className={styles.statGrid}>
            <StatCard label="Attempts" value={attempts} centered />
            <StatCard label="Pass Rate" value={`${passRate}%`} centered />
            <StatCard label="Avg Score" value={avgScore} centered />
          </div>

          {results.length === 0 ? (
            <div className={styles.emptyBox}>No submissions yet.</div>
          ) : (
            <div className={styles.resultList}>
              {results.map((r) => (
                <ResultRow
                  key={r.id}
                  result={r}
                  expanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  passingScore={exam?.passingScore}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}