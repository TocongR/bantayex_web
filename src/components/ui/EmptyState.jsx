import styles from './EmptyState.module.css';

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.text}>{message}</p>
      {actionLabel && (
        <button onClick={onAction} className={styles.btn}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}