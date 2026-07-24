import styles from './GradientHero.module.css';

export default function GradientHero({ children, padding = 'lg' }) {
  return (
    <section className={styles.hero}>
      <div className={styles.gradient} />
      <div className={`${styles.inner} ${padding === 'md' ? styles.paddingMd : styles.paddingLg}`}>
        {children}
      </div>
    </section>
  );
}