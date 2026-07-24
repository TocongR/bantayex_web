import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AIExamAssistant from './AIExamAssistant';
import styles from './ExamEditorLayout.module.css';

export default function ExamEditorLayout({
  title,
  backLabel,
  onBack,
  examState,
  onChangeExamState,
  children,
}) {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className={`${styles.shell} ${assistantOpen ? styles.shellShifted : ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={onBack} className={styles.backBtn}>
            <ArrowLeft size={14} />
            {backLabel}
          </button>
          <button
            onClick={() => setAssistantOpen((v) => !v)}
            className={`${styles.assistantToggle} ${assistantOpen ? styles.assistantToggleHidden : ''}`}
          >
            <Sparkles size={14} />
            AI Assistant
          </button>
        </div>

        <h2 className={styles.title}>{title}</h2>

        {children}
      </div>

      {/* Kept mounted (rather than conditionally rendered) so it can slide in/out
          instead of popping — visibility is purely transform/opacity driven. */}
      <div className={`${styles.panel} ${assistantOpen ? styles.panelOpen : styles.panelClosed}`}>
        <AIExamAssistant
          examState={examState}
          onChangeExamState={onChangeExamState}
          onClose={() => setAssistantOpen(false)}
        />
      </div>
    </div>
  );
}