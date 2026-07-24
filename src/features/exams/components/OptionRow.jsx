import { X } from 'lucide-react';
import AutoGrowTextarea from './AutoGrowTextarea';
import { optionLabel } from '../lib/examState';
import styles from './OptionRow.module.css';

export default function OptionRow({ option, index, isCorrect, canRemove, onChange, onSetCorrect, onRemove }) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        onClick={onSetCorrect}
        title="Mark as correct answer"
        className={`${styles.letterBtn} ${isCorrect ? styles.letterBtnActive : ''}`}
      >
        {optionLabel(index)}
      </button>
      <AutoGrowTextarea
        placeholder={`Option ${optionLabel(index)}`}
        value={option.text}
        onChange={(e) => onChange(e.target.value)}
        className={styles.optionInput}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        title={canRemove ? 'Remove option' : 'At least 2 options required'}
        className={styles.removeBtn}
      >
        <X size={16} />
      </button>
    </div>
  );
}