import { Maximize2, Check } from 'lucide-react';
import FadeIn from '../../../components/ui/FadeIn';
import ActionPreview from './ActionPreview';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ message, examState, onExpand, onApply, onDiscard }) {
  const isUser = message.role === 'user';
  return (
    <FadeIn className={isUser ? styles.rowEnd : styles.rowStart}>
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleModel}`}>
        <p className={styles.text}>{message.text}</p>

        {message.action && (
          <div className={styles.actionCard}>
            <div className={styles.actionHeader}>
              <p className={styles.actionSummary}>{message.action.summary}</p>
              <button type="button" onClick={onExpand} title="View full details" className={styles.expandBtn}>
                <Maximize2 size={13} />
              </button>
            </div>
            <ActionPreview examState={examState} action={message.action} />
            {message.applied ? (
              <FadeIn className={styles.appliedBadge}>
                <Check size={12} /> Applied
              </FadeIn>
            ) : (
              <div className={styles.actionButtons}>
                <button type="button" onClick={onApply} className={styles.applyBtn}>
                  Apply
                </button>
                <button type="button" onClick={onDiscard} className={styles.discardBtn}>
                  Discard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
}