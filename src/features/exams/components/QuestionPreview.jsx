import { optionLabel } from '../lib/examState';
import { optionText } from '../lib/actionPreviewHelpers';
import styles from './QuestionPreview.module.css';

export default function QuestionPreview({ q, dimmed = false }) {
  return (
    <div className={`${styles.card} ${dimmed ? styles.dimmed : ''}`}>
      <p className={`${styles.text} ${dimmed ? styles.textDimmed : ''}`}>
        {q.text || <em className={styles.empty}>(empty)</em>}
      </p>
      <ul className={styles.optionList}>
        {(q.options || []).map((opt, i) => (
          <li
            key={i}
            className={
              dimmed ? styles.optionDimmed : i === q.correctAnswer ? styles.optionCorrect : styles.optionDefault
            }
          >
            {optionLabel(i)}. {optionText(opt)}
            {!dimmed && i === q.correctAnswer ? ' ✓' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}