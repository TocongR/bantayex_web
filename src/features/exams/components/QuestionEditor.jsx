import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import AutoGrowTextarea from './AutoGrowTextarea';
import OptionRow from './OptionRow';
import FadeIn from '../../../components/ui/FadeIn';
import styles from './QuestionEditor.module.css';

export default function QuestionEditor({
  question,
  index,
  isFirst,
  isLast,
  isLastInList,
  delay,
  onChangeText,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAddOption,
  onChangeOption,
  onRemoveOption,
  onSetCorrect,
}) {
  return (
    <FadeIn delay={delay} className={`${styles.card} ${isLastInList ? styles.cardNoBorder : ''}`}>
      <div className={styles.header}>
        <span className={styles.number}>{index + 1}</span>
        <span className={styles.label}>Question {index + 1}</span>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
            className={styles.iconBtn}
          >
            <ChevronUp size={15} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
            className={styles.iconBtn}
          >
            <ChevronDown size={15} />
          </button>
          <button type="button" onClick={onRemove} className={styles.deleteIconBtn}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <AutoGrowTextarea
          placeholder="Question text"
          value={question.text}
          onChange={(e) => onChangeText(e.target.value)}
          className={styles.questionInput}
        />

        <div className={styles.optionsList}>
          {question.options.map((opt, optIdx) => (
            <OptionRow
              key={opt.id}
              option={opt}
              index={optIdx}
              isCorrect={question.correctAnswer === optIdx}
              canRemove={question.options.length > 2}
              onChange={(val) => onChangeOption(opt.id, val)}
              onSetCorrect={() => onSetCorrect(optIdx)}
              onRemove={() => onRemoveOption(opt.id)}
            />
          ))}
        </div>

        <button type="button" onClick={onAddOption} className={styles.addOptionBtn}>
          <Plus size={14} />
          Add Option
        </button>

        <p className={styles.hint}>Click a letter to mark that option as the correct answer.</p>
      </div>
    </FadeIn>
  );
}