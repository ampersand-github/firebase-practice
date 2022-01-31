import { CollectionReference, Firestore } from "@firebase/firestore";
import { collection } from "firebase/firestore";

export const createCollectionPath = (
  firestore: Firestore,
  collectionPath: [string, ...string[]]
): CollectionReference => {
  const [path, ...rest] = collectionPath;
  return collection(firestore, path, ...rest);
};
