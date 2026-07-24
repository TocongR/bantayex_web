import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// excludeId: pass the current exam's own id when editing, so it doesn't
// flag its own unchanged code as "taken."
export async function isExamCodeTaken(code, { excludeId } = {}) {
  const q = query(collection(db, 'exams'), where('examCode', '==', code), limit(excludeId ? 2 : 1));
  const snap = await getDocs(q);
  if (excludeId) return snap.docs.some((d) => d.id !== excludeId);
  return !snap.empty;
}