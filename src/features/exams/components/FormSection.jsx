import Eyebrow from '../../../components/ui/Eyebrow';
import styles from './FormSection.module.css';

export default function FormSection({ label, description, children }) {
  return (
    <section className={styles.section}>
      <Eyebrow>{label}</Eyebrow>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
}