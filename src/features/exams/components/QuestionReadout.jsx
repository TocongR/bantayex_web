import { optionLabel } from '../lib/examState';
import styles from './QuestionReadout.module.css';

export default function QuestionReadout({ question, index, isLast }) {
  return (
    <div className={`${styles.item} ${isLast ? styles.itemLast : ''}`}>
      <div className={styles.header}>
        <span className={styles.number}>{index + 1}</span>
        <p className={styles.text}>{question.text}</p>
      </div>
      <div className={styles.options}>
        {(question.options || []).map((opt, oi) => (
          <div key={oi} className={oi === question.correctAnswer ? styles.optionCorrect : styles.option}>
            <span className={styles.optionLetter}>{optionLabel(oi)}.</span>
            {opt}
            {oi === question.correctAnswer && <span className={styles.check}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}