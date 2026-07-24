import { X } from 'lucide-react';
import FadeIn from '../../../components/ui/FadeIn';
import ActionPreview from './ActionPreview';
import styles from './ActionDetailModal.module.css';

export default function ActionDetailModal({ message, examState, onClose, onApply, onDiscard }) {
  if (!message?.action) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <FadeIn className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.title}>{message.action.summary}</p>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.body}>
          <ActionPreview examState={examState} action={message.action} expanded />
        </div>
        {!message.applied && (
          <div className={styles.footer}>
            <button type="button" onClick={onApply} className={styles.applyBtn}>
              Apply
            </button>
            <button type="button" onClick={onDiscard} className={styles.discardBtn}>
              Discard
            </button>
          </div>
        )}
      </FadeIn>
    </div>
  );
}