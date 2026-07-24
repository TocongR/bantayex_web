import { fieldLabel } from '../lib/examState';
import { toPlainOptions } from '../lib/actionPreviewHelpers';
import QuestionPreview from './QuestionPreview';
import styles from './ActionPreview.module.css';

export default function ActionPreview({ examState, action, expanded = false }) {
  const currentById = Object.fromEntries(examState.questions.map((q) => [q.id, q]));
  const hasSet = action.set && Object.keys(action.set).length > 0;

  return (
    <div className={`${styles.wrap} ${expanded ? '' : styles.scrollable}`}>
      {hasSet && (
        <div>
          <p className={styles.groupLabel}>Settings</p>
          <ul className={styles.settingsList}>
            {Object.entries(action.set).map(([k, v]) => (
              <li key={k}>
                <span className={styles.settingKey}>{fieldLabel(k)}:</span> {String(v)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {action.questions?.add?.length > 0 && (
        <div>
          <p className={`${styles.groupLabel} ${styles.groupLabelGreen}`}>
            Adding {action.questions.add.length}
          </p>
          <div className={styles.itemList}>
            {action.questions.add.map((q, i) => (
              <QuestionPreview key={i} q={q} />
            ))}
          </div>
        </div>
      )}

      {action.questions?.update?.length > 0 && (
        <div>
          <p className={`${styles.groupLabel} ${styles.groupLabelAmber}`}>
            Editing {action.questions.update.length}
          </p>
          <div className={styles.updateList}>
            {action.questions.update.map((patchQ, i) => {
              const original = currentById[patchQ.id];
              const merged = {
                text: patchQ.text !== undefined ? patchQ.text : original?.text,
                options: patchQ.options !== undefined ? patchQ.options : toPlainOptions(original?.options),
                correctAnswer:
                  patchQ.correctAnswer !== undefined ? patchQ.correctAnswer : original?.correctAnswer,
              };
              return (
                <div key={i} className={styles.updateItem}>
                  {original && (
                    <div className={styles.before}>
                      <p className={styles.microLabel}>Before</p>
                      <QuestionPreview q={{ ...original, options: toPlainOptions(original.options) }} />
                    </div>
                  )}
                  <div>
                    <p className={`${styles.microLabel} ${styles.microLabelAmber}`}>After</p>
                    <QuestionPreview q={merged} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {action.questions?.remove?.length > 0 && (
        <div>
          <p className={`${styles.groupLabel} ${styles.groupLabelRed}`}>
            Removing {action.questions.remove.length}
          </p>
          <div className={styles.itemList}>
            {action.questions.remove.map((id) =>
              currentById[id] ? (
                <QuestionPreview key={id} q={currentById[id]} dimmed />
              ) : (
                <p key={id} className={styles.goneNotice}>
                  Question no longer exists (already removed or changed).
                </p>
              ),
            )}
          </div>
        </div>
      )}

      {action.questions?.reorder?.length > 0 && (
        <div>
          <p className={`${styles.groupLabel} ${styles.groupLabelBlue}`}>Reordering questions</p>
          <ol className={styles.reorderList}>
            {action.questions.reorder.map((id) => (
              <li key={id} className={currentById[id] ? '' : styles.reorderMissing}>
                {currentById[id]?.text || 'Unknown question'}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}