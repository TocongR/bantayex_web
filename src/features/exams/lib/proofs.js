import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

/**
 * Loads evidence photos from the "violation_proofs" collection.
 *
 * The Android app stores each photo as a Firestore Blob (compressed JPEG). The web SDK
 * returns that field as a `Bytes` object, which we turn into a data: URL for <img>.
 *
 * Returns a map: proofId -> { src, type, timestamp }  (or null if the document doesn't
 * exist yet, e.g. the student's phone is still uploading it).
 *
 * Photos are only fetched when a result row is expanded, so merely opening the results
 * page costs no extra Firestore reads (Spark plan: 50K reads/day).
 */
export async function fetchProofs(ids) {
  const unique = [...new Set(ids)];
  const snaps = await Promise.all(unique.map((id) => getDoc(doc(db, 'violation_proofs', id))));

  const map = {};
  snaps.forEach((snap, i) => {
    if (!snap.exists()) {
      map[unique[i]] = null;
      return;
    }
    const data = snap.data();
    map[unique[i]] = {
      src: data.image ? `data:image/jpeg;base64,${data.image.toBase64()}` : null,
      type: data.type,
      timestamp: data.timestamp,
    };
  });
  return map;
}