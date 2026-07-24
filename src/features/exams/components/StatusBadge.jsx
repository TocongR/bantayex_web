import styles from './StatusBadge.module.css';

const CLASS_BY_LABEL = {
  ACTIVE: styles.active,
  UPCOMING: styles.upcoming,
  EXPIRED: styles.expired,
};

export default function StatusBadge({ label }) {
  return <span className={`${styles.badge} ${CLASS_BY_LABEL[label] || ''}`}>{label}</span>;
}