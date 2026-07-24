import { Clock, Hash, Users, Pencil, Trash2, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getExamStatus } from '../lib/examStatus';
import styles from './ExamListItem.module.css';

export default function ExamListItem({ exam, onOpen, onEdit, onResults, onDeleteRequest, showDivider }) {
  const status = getExamStatus(exam);
  const canEdit = status.label !== 'ACTIVE';

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div>
      <div className={styles.row} onClick={onOpen}>
        <div className={styles.code}>{exam.examCode}</div>

        <div className={styles.info}>
          <h3 className={styles.title}>{exam.title}</h3>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <Clock size={12} />
              {exam.timeLimitMinutes} min
            </span>
            <span className={styles.metaItem}>
              <Hash size={12} />
              {exam.questions?.length || 0} question{exam.questions?.length === 1 ? '' : 's'}
            </span>
            <span className={styles.metaText}>
              Pass: {exam.passingScore}/{exam.questions?.length || 0}
            </span>
          </div>
          {exam.availableDate && (
            <p className={styles.dateText}>
              {exam.availableDate}
              {exam.availableFrom && `  ${exam.availableFrom} – ${exam.availableTo}`}
            </p>
          )}
        </div>

        <div className={styles.side}>
          <StatusBadge label={status.label} />
          <div className={styles.actions}>
            {canEdit && (
              <button onClick={stop(onEdit)} className={styles.actionBtn}>
                <Pencil size={12} />
                Edit
              </button>
            )}
            <button onClick={stop(onResults)} className={styles.actionBtn}>
              <Users size={12} />
              Results
            </button>
            <button onClick={stop(onDeleteRequest)} className={styles.deleteBtn}>
              <Trash2 size={12} />
              Delete
            </button>
            <ChevronRight size={15} className={styles.chevron} />
          </div>
        </div>
      </div>
      {showDivider && <div className={styles.divider} />}
    </div>
  );
}