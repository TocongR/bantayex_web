import styles from './Eyebrow.module.css';

export default function Eyebrow({ children, light = false }) {
  return <p className={`${styles.eyebrow} ${light ? styles.light : ''}`}>{children}</p>;
}