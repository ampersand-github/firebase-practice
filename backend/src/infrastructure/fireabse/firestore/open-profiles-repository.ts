import _firestore from "@google-cloud/firestore";
import { pathConverterFromSlashToList } from "../../../../../src/infrastructure/firebase/firestore/__shared__/path-converter-from-list-to-slash";
import { OPEN_PROFILES_COLLECTION_PATH } from "../../../../../src/constant/firestore";
import { firestore } from "firebase-admin";
import { IQuestion } from "./questions-repository";
import CollectionReference = firestore.CollectionReference;
import { IOpenProfileConverter } from "./open-profile-converter";

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
  private readonly converter: IOpenProfileConverter;

  public constructor(
    db: _firestore.Firestore,
    converter: IOpenProfileConverter
  ) {
    this.db = db;
    const _path = pathConverterFromSlashToList(OPEN_PROFILES_COLLECTION_PATH);
    this.ref = this.db.collection(_path);
    this.converter = converter;
  }

  public findAll = async (): Promise<IOpenProfile[]> => {
    const snapshot = await this.ref.get();
    const result: IOpenProfile[] = [];
    snapshot.docs.map((s) => {
      result.push(this.converter(s));
    });
    return result;
  };

  public findOne = async (id: string): Promise<IOpenProfile> => {
    const snapshot = await this.ref.doc(id).get();
    return this.converter(snapshot);
  };

  // 課題だけをつくる、初期化用、本当はリポジトリにつくるべきでないが、面倒なので
  public createInitOnly = async (props: IOpenProfile): Promise<void> => {
    const { id, ...others } = props;
    await this.ref.doc(id).create(others);
  };

  public update = async (props: IOpenProfile): Promise<void> => {
    const { id, ...others } = props;
    await this.ref.doc(id).update(others);
  };

  public deleteAll = async (): Promise<void> => {
    const all = await this.findAll();
    all.map((q: IOpenProfile) => {
      this.ref.doc(q.id).delete();
    });
  };

  public deleteOne = async (id: string): Promise<void> => {
    await this.ref.doc(id).delete();
  };
}
