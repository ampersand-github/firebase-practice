import { DocumentReference, Firestore } from "@firebase/firestore";
import { doc } from "firebase/firestore";

export const createDocPath = (
  firestore: Firestore,
  collectionPath: [string, ...string[]],
  docId: string
): DocumentReference => {
  const [path, ...rest] = collectionPath;
  return doc(firestore, path, ...rest, docId);
};
