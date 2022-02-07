import _firestore from "@google-cloud/firestore";
import { pathConverterFromSlashToList } from "../../../../../src/infrastructure/firebase/firestore/__shared__/path-converter-from-list-to-slash";
import {
  OPEN_PROFILES_COLLECTION_PATH,
  QUESTIONS_COLLECTION_PATH,
} from "../../../../../src/constant/firestore";
import { firestore } from "firebase-admin";
import { IOpenProfile, IQuestions } from "./open-profiles-repository";
import { openProfileConverter } from "./open-profile-converter";
import CollectionReference = firestore.CollectionReference;
import Transaction = firestore.Transaction;

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
  private readonly questionsRef: CollectionReference;
  private readonly openProfilesRef: CollectionReference;

  public constructor(db: _firestore.Firestore) {
    this.db = db;
    const _path = pathConverterFromSlashToList(QUESTIONS_COLLECTION_PATH);
    const __path = pathConverterFromSlashToList(OPEN_PROFILES_COLLECTION_PATH);
    this.questionsRef = this.db.collection(_path);
    this.openProfilesRef = this.db.collection(__path);
  }

  public findAll = async (): Promise<IQuestion[]> => {
    const questions: IQuestion[] = [];
    const snapshot = await this.questionsRef.get();
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

  public findOne = async (id: string): Promise<IQuestion> => {
    const snapshot = await this.questionsRef.doc(id).get();
    const data = snapshot.data();

    if (!data) {
      throw new Error("このidは存在しません。");
    }

    return {
      id: data.id.toString(),
      no: data.no,
      title: data.title,
      description: data.description,
    };
  };

  // 課題だけをつくる、初期化用、本当はリポジトリにつくるべきでないが、面倒なので
  public createInitOnly = async (props: IQuestion): Promise<void> => {
    const { id, ...others } = props;
    await this.questionsRef.doc(id).create(others);
  };

  // https://www.wakuwakubank.com/posts/723-firebase-firestore-query/
  public create = async (props: IQuestion): Promise<void> => {
    const { id, ...others } = props;
    await this.questionsRef.doc(id).create(others);

    try {
      await this.db.runTransaction(async (t: Transaction) => {
        //
        const openProfiles = await t.get(this.openProfilesRef);
        openProfiles.docs.map((s) => {
          const _: IOpenProfile = openProfileConverter(s);
          _.questions.push({ ...props, status: "未完了" });
          t.update(this.openProfilesRef.doc(s.id), _);
        });
        t.create(this.questionsRef.doc(id), others);
      });
    } catch (e) {
      console.log(e);
      throw new Error("QuestionsRepository.createエラー");
    }
  };

  public update = async (props: IQuestion): Promise<void> => {
    const { id, ...others } = props;
    try {
      await this.db.runTransaction(async (t: Transaction) => {
        //
        const openProfiles = await t.get(this.openProfilesRef);
        openProfiles.docs.map((s) => {
          const a: IOpenProfile = openProfileConverter(s);

          const n = a.questions.map((q: IQuestions) => {
            if (q.id === id) {
              const update: IQuestions = {
                ...others,
                id: q.id,
                status: "未完了",
              };
              return update;
            }
            return q;
          });

          t.update(this.openProfilesRef.doc(s.id), { questions: n });
        });
        t.update(this.questionsRef.doc(id), others);
      });
    } catch (e) {
      console.log(e);
      throw new Error("QuestionsRepository.createエラー");
    }
  };

  public deleteAll = async (): Promise<void> => {
    const questions = await this.findAll();
    questions.map((q: IQuestion) => {
      this.questionsRef.doc(q.id).delete();
    });
  };

  public deleteOne = async (props: IQuestion): Promise<void> => {
    try {
      await this.db.runTransaction(async (t: Transaction) => {
        const targetQuestion = await t.get(this.questionsRef.doc(props.id));
        //
        const openProfiles = await t.get(this.openProfilesRef);
        openProfiles.docs.map((s) => {
          const _: IOpenProfile = openProfileConverter(s);
          const __ = this.excludeQuestions(_, targetQuestion.id);
          t.update(this.openProfilesRef.doc(s.id), { questions: __ });
        });
        t.delete(this.questionsRef.doc(props.id));
      });
    } catch (e) {
      console.log(e);
      throw new Error("QuestionsRepository.deleteOneエラー");
    }
  };

  // questionIdが合致するquestionをquestionsから排除する。
  private excludeQuestions = (
    props: IOpenProfile,
    questionId: string
  ): IOpenProfile["questions"] => {
    return props.questions.filter((q: IQuestions) => {
      if (q.id !== questionId) {
        return q;
      }
    });
  };
}
