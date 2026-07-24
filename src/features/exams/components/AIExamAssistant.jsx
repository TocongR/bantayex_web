import { useRef, useState } from 'react';
import { Sparkles, Undo2, X } from 'lucide-react';
import { applyPatch } from '../lib/examState';
import { extractFileText } from '../lib/fileExtraction';
import { requestExamAction, hasGeminiApiKey } from '../lib/geminiClient';
import ChatMessage from './ChatMessage';
import ActionDetailModal from './ActionDetailModal';
import ChatComposer from './ChatComposer';
import TypingIndicator from './TypingIndicator';
import styles from './AIExamAssistant.module.css';

export default function AIExamAssistant({ examState, onChangeExamState, onClose }) {
  const [messages, setMessages] = useState([]); // { role, text, action?, applied? }
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const scrollRef = useRef(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }

  async function handleFilePick(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setFileLoading(true);
    try {
      const content = await extractFileText(file);
      setAttachedFile({ name: file.name, content });
      setShowFilePreview(false);
    } catch (err) {
      alert(`Couldn't read "${file.name}": ${err.message}`);
    } finally {
      setFileLoading(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text && !attachedFile) return;
    if (!hasGeminiApiKey()) {
      alert('Missing VITE_GEMINI_API_KEY — set it in your .env file and restart the dev server.');
      return;
    }

    const userMessageForChat = attachedFile ? `${text || '(see attached file)'}\n\n📎 ${attachedFile.name}` : text;
    const userTurnForModel = attachedFile
      ? `${text}\n\nAttached file "${attachedFile.name}":\n${attachedFile.content}`
      : text;

    const priorTurns = messages;
    setMessages((prev) => [...prev, { role: 'user', text: userMessageForChat, modelText: userTurnForModel }]);
    setInput('');
    setAttachedFile(null);
    setSending(true);
    scrollToBottom();

    try {
      // Important: replay the FULL text sent to the model for each turn (modelText/rawText),
      // not the shortened display text — otherwise file content "disappears" from context
      // on every turn after the one where it was attached.
      const contents = priorTurns
        .filter((m) => m.role === 'user' || m.role === 'model')
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.role === 'model' ? m.rawText || m.text : m.modelText || m.text }],
        }));
      contents.push({ role: 'user', parts: [{ text: userTurnForModel }] });

      const { reply, action, rawText } = await requestExamAction(examState, contents);
      setMessages((prev) => [...prev, { role: 'model', text: reply, rawText, action, applied: false }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'model', text: `⚠️ ${err.message}`, action: null }]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }

  function applyAction(msgIndex) {
    setMessages((prev) => {
      const msg = prev[msgIndex];
      if (!msg?.action || msg.applied) return prev;
      setUndoStack((stack) => [...stack, examState]);
      onChangeExamState(applyPatch(examState, msg.action));
      const next = [...prev];
      next[msgIndex] = { ...msg, applied: true };
      return next;
    });
  }

  function discardAction(msgIndex) {
    setMessages((prev) => {
      const next = [...prev];
      next[msgIndex] = { ...next[msgIndex], action: null };
      return next;
    });
  }

  function undoLast() {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      onChangeExamState(stack[stack.length - 1]);
      return stack.slice(0, -1);
    });
  }

  const expandedMessage = expandedIndex !== null ? messages[expandedIndex] : null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Sparkles size={16} className={styles.headerIcon} />
        <p className={styles.headerTitle}>Exam Assistant</p>
        <div className={styles.headerActions}>
          {undoStack.length > 0 && (
            <button type="button" onClick={undoLast} title="Undo last applied AI change" className={styles.undoBtn}>
              <Undo2 size={12} />
              Undo
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className={styles.messages}>
        {!hasGeminiApiKey() && (
          <p className={styles.missingKeyNotice}>
            Missing <code>VITE_GEMINI_API_KEY</code> — add it to your <code>.env</code> and restart the dev
            server.
          </p>
        )}
        {messages.length === 0 && (
          <p className={styles.emptyHint}>
            Ask me to draft questions, tweak settings, or clean up the exam — e.g. "add 3 questions about
            the water cycle" or "make question 2 true/false". Attach a PDF, DOCX, or text file and I'll read
            it for context. You'll see every question and choice before anything is applied.
          </p>
        )}
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            message={m}
            examState={examState}
            onExpand={() => setExpandedIndex(i)}
            onApply={() => applyAction(i)}
            onDiscard={() => discardAction(i)}
          />
        ))}
        {sending && <TypingIndicator />}
      </div>

      <ChatComposer
        input={input}
        onChangeInput={setInput}
        onSend={sendMessage}
        attachedFile={attachedFile}
        onPickFile={handleFilePick}
        onRemoveFile={() => setAttachedFile(null)}
        showFilePreview={showFilePreview}
        onToggleFilePreview={() => setShowFilePreview((v) => !v)}
        fileLoading={fileLoading}
        sending={sending}
      />

      {expandedMessage?.action && (
        <ActionDetailModal
          message={expandedMessage}
          examState={examState}
          onClose={() => setExpandedIndex(null)}
          onApply={() => {
            applyAction(expandedIndex);
            setExpandedIndex(null);
          }}
          onDiscard={() => {
            discardAction(expandedIndex);
            setExpandedIndex(null);
          }}
        />
      )}
    </div>
  );
}