import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDark}>Bantay</span>
          <span className={styles.logoLight}>Ex</span>
        </Link>
        <div className={styles.right}>
          <Link to="/about" className={styles.link}>About this project</Link>
          <p className={styles.tagline}>Vision-based proctored exams.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;