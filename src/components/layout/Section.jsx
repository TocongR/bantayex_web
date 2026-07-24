import styles from './Section.module.css';

export default function Section({ children, id, className = '', divider = true, compact = false }) {
  const cls = [styles.section, compact ? styles.compact : '', divider ? styles.divider : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <section id={id} className={cls}>
      {children}
    </section>
  );
}