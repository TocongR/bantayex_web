import styles from './MetaItem.module.css';

export default function MetaItem({ icon, label, value, mono }) {
  return (
    <div>
      <div className={styles.labelRow}>
        {icon}
        <span className={styles.label}>{label}</span>
      </div>
      <p className={`${styles.value} ${mono ? styles.mono : ''}`}>{value}</p>
    </div>
  );
}