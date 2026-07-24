import Button from './Button';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel} className={styles.flex}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} className={styles.flex}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}