import _firestore from "@google-cloud/firestore";
import { pathConverterFromSlashToList } from "../../../../../src/infrastructure/firebase/firestore/__shared__/path-converter-from-list-to-slash";
import { OPEN_PROFILES_COLLECTION_PATH } from "../../../../../src/constant/firestore";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import { IQuestion } from "./questions-repository";

// todo あとで分離
export interface IOpenProfilesRepository {}

export type IQuestions = IQuestion & { status: string };

export interface IOpenProfile {
  id: string; // uuidV4が望ましい
  displayName: string;
  questions: IQuestions[];
}

export class OpenProfilesRepository implements IOpenProfilesRepository {
  private readonly db: _firestore.Firestore;
  private readonly ref: CollectionReference;

  public constructor(db: _firestore.Firestore) {
    this.db = db;
    const _path = pathConverterFromSlashToList(OPEN_PROFILES_COLLECTION_PATH);
    this.ref = this.db.collection(_path);
  }

  public findAll = async (): Promise<IOpenProfile[]> => {
    const snapshot = await this.ref.get();
    const result: IOpenProfile[] = [];
    snapshot.docs.map((s) => {
      const data = s.data();
      const target: IOpenProfile = {
        id: s.id.toString(),
        displayName: data.displayName,
        questions: data.questions.map((one: IQuestions) => {
          return {
            questionId: one.id,
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

  public create = async (props: IOpenProfile): Promise<void> => {
    const { id, ...others } = props;
    await this.ref.doc(id).create(others);
  };

  public update = async (props: IOpenProfile): Promise<void> => {
    const { id, ...others } = props;
    await this.ref.doc(id).update(others);
  };

  /*
  public questionFinished = async (
    openProfileRef: DocumentReference,
    questionRef: DocumentReference
  ): Promise<void> => {
    const finished = QuestionStatus.create({
      questionStatus: QuestionStatusEnum.finished,
    });

    const a = await openProfileRef.get();
    console.log("- - - - - - ");
    const data = a.data();

    if (!data) {
      throw new Error("課題が登録されていません。");
    }

    const updated = await data.questions.map((one: IQuestions) => {
      if (one.id === questionRef.id) {
        return { ...one, status: finished.QuestionStatus };
      }
      return one;
    });

    await this.ref.doc(a.id).update({ ...data, questions: updated });
  };
 */

  public deleteAll = async (): Promise<void> => {
    const all = await this.findAll();
    all.map((q: IOpenProfile) => {
      this.ref.doc(q.id).delete();
    });
  };
}
