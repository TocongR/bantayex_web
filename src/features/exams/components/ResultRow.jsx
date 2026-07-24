import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { formatDate, formatViolationType } from '../lib/formatters';
import styles from './ResultRow.module.css';

function InfoItem({ label, value }) {
  return (
    <div>
      <p className={styles.infoLabel}>{label}</p>
      <p className={styles.infoValue}>{value}</p>
    </div>
  );
}

export default function ResultRow({ result, expanded, onToggle, passingScore }) {
  const violations = result.violations ?? result.violationLog?.length ?? 0;

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
          <div className={styles.infoGrid}>
            <InfoItem label="Auto-submitted" value={result.autoSubmitted ? 'Yes' : 'No'} />
            <InfoItem label="Gaze monitoring" value={result.gazeMonitoringEnabled ? 'Enabled' : 'Disabled'} />
          </div>

          {result.violationLog?.length > 0 && (
            <div>
              <p className={styles.logHeading}>Violation Log ({result.violationLog.length})</p>
              <div className={styles.logList}>
                {result.violationLog.map((v, i) => (
                  <div key={i} className={styles.logRow}>
                    <span className={styles.logType}>{formatViolationType(v.type)}</span>
                    <span className={styles.logTime}>{formatDate(v.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}