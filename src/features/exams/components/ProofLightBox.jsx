import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './ProofLightBox.module.css';

/** Full-size evidence viewer. Closes on backdrop click, the X button, or Escape. */
export default function ProofLightbox({ preview, onClose }) {
  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview, onClose]);

  if (!preview) return null;

  // Portal to <body> so no ancestor (overflow/transform) can clip or offset the overlay.
  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <img src={preview.src} alt={preview.label} className={styles.image} />
        <figcaption className={styles.caption}>
          <span className={styles.label}>{preview.label}</span>
          <span className={styles.time}>{preview.time}</span>
        </figcaption>
      </figure>
    </div>,
    document.body
  );
}