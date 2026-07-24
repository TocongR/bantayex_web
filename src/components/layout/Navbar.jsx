import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoDark}>Bantay</span>
          <span className={styles.logoLight}>Ex</span>
        </Link>

        <div className={styles.desktopLinks}>
          <Link to="/about" className={styles.link}>About</Link>
          <Link to="/login" className={styles.link}>Sign in</Link>
          <Link to="/register" className={styles.cta}>Create account</Link>
        </div>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={styles.mobilePanel}>
          <Link to="/about" className={styles.mobileLink} onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to="/login" className={styles.mobileLink} onClick={() => setOpen(false)}>
            Professor sign in
          </Link>
          <Link to="/register" className={styles.mobileCta} onClick={() => setOpen(false)}>
            Create account
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;