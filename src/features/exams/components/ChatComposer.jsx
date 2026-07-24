import { useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import styles from './ChatComposer.module.css';

export default function ChatComposer({
  input,
  onChangeInput,
  onSend,
  attachedFile,
  onPickFile,
  onRemoveFile,
  showFilePreview,
  onToggleFilePreview,
  fileLoading,
  sending,
}) {
  const fileInputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className={styles.wrap}>
      {attachedFile && (
        <div className={styles.attachment}>
          <div className={styles.attachmentRow}>
            <Paperclip size={12} />
            <span className={styles.attachmentName}>{attachedFile.name}</span>
            <button type="button" onClick={onToggleFilePreview} className={styles.previewToggle}>
              {showFilePreview ? 'hide' : 'preview'}
            </button>
            <button type="button" onClick={onRemoveFile} className={styles.removeBtn}>
              <X size={12} />
            </button>
          </div>
          {showFilePreview && <pre className={styles.attachmentPreview}>{attachedFile.content}</pre>}
        </div>
      )}
      <div className={styles.row}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.csv,.json,.pdf,.docx"
          onChange={onPickFile}
          className={styles.hiddenInput}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={fileLoading}
          title="Attach a PDF, DOCX, or text file for context"
          className={styles.attachBtn}
        >
          <Paperclip size={16} />
        </button>
        <textarea
          rows={1}
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={fileLoading ? 'Reading file…' : 'Ask the assistant to build or edit the exam…'}
          className={styles.textarea}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={sending || fileLoading || (!input.trim() && !attachedFile)}
          className={styles.sendBtn}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}