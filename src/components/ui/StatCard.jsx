import styles from './StatCard.module.css';

export default function StatCard({ icon, label, value, centered = false }) {
  return (
    <div className={`${styles.card} ${centered ? styles.centered : ''}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}