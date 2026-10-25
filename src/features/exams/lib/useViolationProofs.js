import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchProofs } from './proofs';

/**
 * Lazily loads the evidence photos for one result's violation log.
 * Nothing is fetched until `enabled` becomes true (row expanded), and only once.
 *
 * status: 'idle' | 'loading' | 'done' | 'error'
 */
export function useViolationProofs(violationLog, enabled) {
  const ids = useMemo(
    () => (violationLog || []).map((v) => v.proofId).filter(Boolean),
    [violationLog]
  );
  const [proofs, setProofs] = useState({});
  const [status, setStatus] = useState('idle');
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || ids.length === 0 || startedRef.current) return;
    startedRef.current = true;
    setStatus('loading');
    fetchProofs(ids)
      .then((map) => {
        setProofs(map);
        setStatus('done');
      })
      .catch((err) => {
        console.error('Failed to load evidence photos', err);
        setStatus('error');
      });
  }, [enabled, ids]);

  return { proofs, status, count: ids.length };
}