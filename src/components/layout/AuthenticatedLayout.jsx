import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import styles from './AuthenticatedLayout.module.css';

const AuthenticatedLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  const navLinks = (
    <>
      <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
        Dashboard
      </NavLink>
      <NavLink to="/exams" className={linkClass} onClick={() => setMenuOpen(false)}>
        Exams
      </NavLink>
      {/* Add Students / Settings links here as those pages get built */}
    </>
  );

  return (
    <div className={styles.shell}>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <Link to="/dashboard" className={styles.mobileLogo}>
          <span className={styles.logoDark}>Bantay</span>
          <span className={styles.logoLight}>Ex</span>
        </Link>
        <button onClick={() => setMenuOpen((v) => !v)} className={styles.mobileToggle}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks}
          <Button variant="secondary" onClick={handleLogout} className={styles.mobileLogout}>
            Log out
          </Button>
        </div>
      )}

      {/* Desktop sidebar — sticky so it stays pinned instead of scrolling with the page */}
      <aside className={styles.sidebar}>
        <Link to="/dashboard" className={styles.sidebarLogo}>
          <span className={styles.logoDark}>Bantay</span>
          <span className={styles.logoLight}>Ex</span>
        </Link>
        <nav className={styles.nav}>{navLinks}</nav>
        <div className={styles.userCard}>
          <p className={styles.userEmail}>{user?.email}</p>
          <Button variant="secondary" onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </Button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;