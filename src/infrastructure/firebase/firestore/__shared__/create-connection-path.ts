import { CollectionReference, Firestore } from "@firebase/firestore";
import { IFirestoreVersion } from "../../../../constant/firestore/verison";
import { collection } from "firebase/firestore";

export const createCollectionPath = (
  firestore: Firestore,
  version: IFirestoreVersion,
  restPath: string[]
): CollectionReference => {
  return collection(firestore, version.version, version.docId, ...restPath);
};
