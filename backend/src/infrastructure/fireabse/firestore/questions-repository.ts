import _firestore from "@google-cloud/firestore";
import { pathConverterFromSlashToList } from "../../../../../src/infrastructure/firebase/firestore/__shared__/path-converter-from-list-to-slash";
import { QUESTIONS_COLLECTION_PATH } from "../../../../../src/constant/firestore";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;

// todo あとで分離
export interface IQuestionsRepository {}

export interface IQuestion {
  id: string; // uuidV4が望ましい
  no: number;
  title: string;
  description: string;
}

export class QuestionsRepository implements IQuestionsRepository {
  private readonly db: _firestore.Firestore;
  private readonly ref: CollectionReference;

  public constructor(db: _firestore.Firestore) {
    this.db = db;
    const _path = pathConverterFromSlashToList(QUESTIONS_COLLECTION_PATH);
    this.ref = this.db.collection(_path);
  }

  public findAll = async (): Promise<IQuestion[]> => {
    const questions: IQuestion[] = [];
    const snapshot = await this.ref.get();
    snapshot.docs.map((s) => {
      const data = s.data();
      const _q: IQuestion = {
        id: s.id.toString(),
        no: data.no,
        title: data.title,
        description: data.description,
      };
      questions.push(_q);
    });
    return questions;
  };

  public create = async (props: IQuestion): Promise<void> => {
    const { id, ...others } = props;
    await this.ref.doc(id).create(others);
  };

  public update = async (props: IQuestion): Promise<void> => {
    const { id, ...others } = props;
    await this.ref.doc(id).update(others);
  };

  public deleteAll = async (): Promise<void> => {
    const questions = await this.findAll();
    questions.map((q: IQuestion) => {
      this.ref.doc(q.id).delete();
    });
  };
}
