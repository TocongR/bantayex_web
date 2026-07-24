import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function LinkButton({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  uppercase = false,
  className = '',
  ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    size === 'lg' ? styles.lg : '',
    uppercase ? styles.uppercase : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...props}>
      {children}
    </a>
  );
}