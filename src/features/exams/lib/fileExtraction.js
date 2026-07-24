import * as pdfjsLib from 'pdfjs-dist';
// Vite-friendly worker import — if your pdfjs-dist version ships `pdf.worker.min.js`
// instead of `.mjs`, change the extension below to match what's in
// node_modules/pdfjs-dist/build/.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const PLAIN_TEXT_EXTENSIONS = ['.txt', '.md', '.csv', '.json'];
export const SUPPORTED_EXTENSIONS = [...PLAIN_TEXT_EXTENSIONS, '.pdf', '.docx'];
export const MAX_CHARS = 20000;

async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n\n';
    if (text.length > MAX_CHARS) break;
  }
  return text;
}

async function extractDocxText(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

function readPlainText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Reads any supported file type and returns its extracted text, trimmed
// and capped to MAX_CHARS. Throws if the extension is unsupported or no
// readable text was found.
export async function extractFileText(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(`Can't read .${ext.slice(1)} — supported: ${SUPPORTED_EXTENSIONS.join(', ')}`);
  }
  let content;
  if (ext === '.pdf') content = await extractPdfText(file);
  else if (ext === '.docx') content = await extractDocxText(file);
  else content = await readPlainText(file);

  content = content.trim();
  if (!content) throw new Error('No readable text found in this file.');
  return content.slice(0, MAX_CHARS);
}