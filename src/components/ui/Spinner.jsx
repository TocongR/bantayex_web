import styles from './Spinner.module.css';

export default function Spinner({ size = 'md' }) {
  return <div className={`${styles.spinner} ${styles[size]}`} role="status" aria-label="Loading" />;
}