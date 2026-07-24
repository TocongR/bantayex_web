import LinkButton from '../components/ui/LinkButton';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <section className={styles.section}>
      <p className={styles.code}>404</p>
      <h2 className={styles.title}>Page not found.</h2>
      <LinkButton to="/" size="lg" uppercase>
        Back to home
      </LinkButton>
    </section>
  );
};

export default NotFoundPage;