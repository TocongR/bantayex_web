import { useEffect, useRef } from 'react';
import styles from './AutoGrowTextarea.module.css';

// Textarea that grows with its content instead of scrolling/clipping.
// Styled to look like a single-line input until it needs more room.
export default function AutoGrowTextarea({ value, onChange, placeholder, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} ${styles.autoGrow}`}
    />
  );
}