import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, ImageOff } from 'lucide-react';
import { formatDate, formatViolationType } from '../lib/formatters';
import { useViolationProofs } from '../lib/useViolationProofs';
import ProofLightbox from './ProofLightbox';
import styles from './ResultRow.module.css';

function InfoItem({ label, value }) {
  return (
    <div>
      <p className={styles.infoLabel}>{label}</p>
      <p className={styles.infoValue}>{value}</p>
    </div>
  );
}

function ProofThumb({ proofId, status, proof, label, onOpen }) {
  if (!proofId) return null; // e.g. "app exit" violations have no photo

  if (status === 'error') {
    return (
      <span className={styles.thumbMissing} title="Couldn't load the image">
        <ImageOff size={16} />
      </span>
    );
  }
  if (status !== 'done') return <span className={styles.thumbSkeleton} />;

  if (!proof || !proof.src) {
    return (
      <span
        className={styles.thumbMissing}
        title="Image unavailable (it may still be uploading from the student's phone)"
      >
        <ImageOff size={16} />
      </span>
    );
  }

  return (
    <button type="button" className={styles.thumbBtn} onClick={onOpen} title="View evidence photo">
      <img src={proof.src} alt={label} className={styles.thumbImg} />
    </button>
  );
}

export default function ResultRow({ result, expanded, onToggle, passingScore }) {
  const violations = result.violations ?? result.violationLog?.length ?? 0;
  const { proofs, status, count: photoCount } = useViolationProofs(result.violationLog, expanded);
  const [preview, setPreview] = useState(null);

  return (
    <div className={styles.card}>
      <button type="button" onClick={onToggle} className={styles.summary}>
        <div className={styles.nameCol}>
          <p className={styles.name}>{result.studentName || 'Unknown student'}</p>
          <p className={styles.date}>{formatDate(result.timestamp)}</p>
        </div>

        <div className={styles.scoreCol}>
          <p className={styles.score}>
            {result.score}/{result.totalQuestions}
          </p>
          {passingScore !== undefined && <p className={styles.passLine}>pass ≥ {passingScore}</p>}
        </div>

        <span className={result.passed ? styles.badgePassed : styles.badgeFailed}>
          {result.passed ? 'Passed' : 'Failed'}
        </span>

        {violations > 0 && (
          <span className={styles.violationFlag}>
            <AlertTriangle size={12} />
            {violations}
          </span>
        )}

        {expanded ? (
          <ChevronUp size={16} className={styles.chevron} />
        ) : (
          <ChevronDown size={16} className={styles.chevron} />
        )}
      </button>

      {expanded && (
        <div className={styles.details}>
          {/* <div className={styles.infoGrid}>
            <InfoItem label="Auto-submitted" value={result.autoSubmitted ? 'Yes' : 'No'} />
            <InfoItem label="Gaze monitoring" value={result.gazeMonitoringEnabled ? 'Enabled' : 'Disabled'} />
          </div> */}

          {result.violationLog?.length > 0 && (
            <div>
              <p className={styles.logHeading}>
                Violation Log ({result.violationLog.length})
                {photoCount > 0 && ` · ${photoCount} photo${photoCount === 1 ? '' : 's'}`}
              </p>
              <div className={styles.logList}>
                {result.violationLog.map((v, i) => {
                  const label = formatViolationType(v.type);
                  const proof = v.proofId ? proofs[v.proofId] : undefined;
                  return (
                    <div key={i} className={styles.logRow}>
                      <ProofThumb
                        proofId={v.proofId}
                        status={status}
                        proof={proof}
                        label={label}
                        onOpen={() =>
                          setPreview({ src: proof.src, label, time: formatDate(v.timestamp) })
                        }
                      />
                      <span className={styles.logType}>{label}</span>
                      <span className={styles.logTime}>{formatDate(v.timestamp)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <ProofLightbox preview={preview} onClose={() => setPreview(null)} />
    </div>
  );
}