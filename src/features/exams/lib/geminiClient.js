import { buildSystemInstruction, GEMINI_MODEL } from './aiPrompt';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function hasGeminiApiKey() {
  return Boolean(API_KEY);
}

// contents: array of { role: 'user' | 'model', parts: [{ text }] } — the full
// chat history to send, in the shape the Gemini API expects.
// Returns { reply, action, rawText }.
export async function requestExamAction(examState, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: buildSystemInstruction(examState) }] },
    contents,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Request failed with status ${res.status}`);

  let raw = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  raw = raw.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { reply: raw, action: null };
  }

  return { reply: parsed.reply || '(no reply)', action: parsed.action || null, rawText: raw };
}