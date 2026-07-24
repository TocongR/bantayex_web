import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getExamStatus } from '../lib/examStatus';
import styles from './ExamRow.module.css';

export default function ExamRow({ exam, onClick, showDivider }) {
  const status = getExamStatus(exam);
  return (
    <div>
      <div className={styles.row} onClick={onClick}>
        <div className={styles.code}>{exam.examCode}</div>
        <div className={styles.info}>
          <h3 className={styles.title}>{exam.title}</h3>
          <p className={styles.meta}>
            {exam.questions?.length || 0} question{exam.questions?.length === 1 ? '' : 's'}
          </p>
        </div>
        <StatusBadge label={status.label} />
        <ChevronRight size={15} className={styles.chevron} />
      </div>
      {showDivider && <div className={styles.divider} />}
    </div>
  );
}