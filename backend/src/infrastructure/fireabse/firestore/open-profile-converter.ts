import { IOpenProfile, IQuestions } from "./open-profiles-repository";
import { firestore } from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;
import DocumentData = firestore.DocumentData;

export type IOpenProfileConverter = (
  snapshot: DocumentSnapshot<DocumentData>
) => IOpenProfile;

export const openProfileConverter: IOpenProfileConverter = (snapshot) => {
  const data = snapshot.data();
  return {
    id: snapshot.id.toString(),
    displayName: data?.displayName,
    questions: data?.questions.map((one: IQuestions) => {
      const _: IQuestions = {
        id: one.id.toString(),
        no: one.no,
        title: one.title,
        description: one.description,
        status: one.status,
      };
      return _;
    }),
  };
};
