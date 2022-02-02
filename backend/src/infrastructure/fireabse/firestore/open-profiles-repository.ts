import _firestore from "@google-cloud/firestore";
import { pathConverterFromSlashToList } from "../../../../../src/infrastructure/firebase/firestore/__shared__/path-converter-from-list-to-slash";
import { OPEN_PROFILES_COLLECTION_PATH } from "../../../../../src/constant/firestore";
import { IQuestionWithRef } from "./questions-repository";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import DocumentReference = firestore.DocumentReference;
// todo あとで分離
export interface IOpenProfilesRepository {}

export type IQuestions = IQuestionWithRef & { status: string };

export interface IOpenProfile {
  displayName: string;
  questions: IQuestions[];
}
export type IOpenProfileWithRef = {
  openProfileRef: DocumentReference;
} & IOpenProfile;

export class OpenProfilesRepository implements IOpenProfilesRepository {
  private readonly db: _firestore.Firestore;
  private readonly ref: CollectionReference;

  public constructor(db: _firestore.Firestore) {
    this.db = db;
    const _path = pathConverterFromSlashToList(OPEN_PROFILES_COLLECTION_PATH);
    this.ref = this.db.collection(_path);
  }

  public findAll = async (): Promise<IOpenProfileWithRef[]> => {
    const snapshot = await this.ref.get();
    const result: IOpenProfileWithRef[] = [];
    snapshot.docs.map((s) => {
      const data = s.data();
      const target: IOpenProfileWithRef = {
        openProfileRef: s.ref,
        displayName: data.displayName,
        questions: data.questions.map((one: IQuestions) => {
          return {
            questionId: one.questionRef,
            no: one.no,
            title: one.title,
            description: one.description,
            status: one.status,
          };
        }),
      };
      result.push(target);
    });
    return result;
  };

  public create = async (props: IOpenProfile) => {
    await this.ref.add(props);
  };

  public deleteAll = async (): Promise<void> => {
    const all = await this.findAll();
    all.map((q: IOpenProfileWithRef) => {
      q.openProfileRef.delete();
    });
  };
}
