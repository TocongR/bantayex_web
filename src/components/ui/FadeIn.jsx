import { useEffect, useState } from 'react';
import styles from './FadeIn.module.css';

export default function FadeIn({ children, className = '', delay = 0, ...rest }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  return (
    <div {...rest} className={`${styles.fade} ${shown ? styles.shown : ''} ${className}`}>
      {children}
    </div>
  );
}