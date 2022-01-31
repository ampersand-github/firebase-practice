import { Firestore, getDoc } from "@firebase/firestore";
import { createCollectionPath } from "./__shared__/create-collection-path";
import {
  OPEN_PROFILES_COLLECTION_PATH,
  QUESTION_STATUS_COLLECTION_PATH,
  QUESTIONS_COLLECTION_PATH,
  USERS_COLLECTION_PATH,
} from "../../../constant/firestore";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { createDocPath } from "./__shared__/create-document-path";
import { v4 as uuidV4 } from "uuid";
import { pathConverterFromSlashToList } from "./__shared__/path-converter-from-slash-to-list";

// todo あとで分離
export interface IPrahaFirestoreRepository {
  // findAll(): Promise<Rank[]>;
  // findOne(userId: string): Promise<Rank>;
  // update(rank: Rank): Promise<void>;
  // create(rank: Rank): Promise<void>;
  // remove(rank: Rank): Promise<void>;
}

export interface IUser {
  id: string;
  email: string;
  displayName: string;
}
export interface IStatus {
  id: string;
  status: string;
}

export interface IQuestion {
  id: string;
  title: string;
}

export class PrahaFirestoreRepository implements IPrahaFirestoreRepository {
  private readonly db: Firestore;

  public constructor(db: Firestore) {
    this.db = db;
  }

  // - - - - - 処理 - - - - - - - - - - - - - - - - - - - -
  private async findAllStatus(): Promise<IStatus[]> {
    const status: IStatus[] = [];
    const STATUS_PATH = QUESTION_STATUS_COLLECTION_PATH;
    const statusPath = createCollectionPath(this.db, STATUS_PATH);
    const statusQuerySnapshot = await getDocs(statusPath);
    await Promise.all(
      statusQuerySnapshot.docs.map(async (one) => {
        status.push({ id: one.id, status: one.data().status });
      })
    );
    return status;
  }

  private async findAllQuestions(): Promise<IQuestion[]> {
    const questions: IQuestion[] = [];
    const questionsP = createCollectionPath(this.db, QUESTIONS_COLLECTION_PATH);
    const questionsQuerySnapshot = await getDocs(questionsP);
    await Promise.all(
      questionsQuerySnapshot.docs.map(async (one) => {
        questions.push({ id: one.id, title: one.data().title });
      })
    );
    return questions;
  }

  public async findAll(): Promise<IUser[]> {
    const status: IStatus[] = this.findAllStatus();
    const questions = this.findAllQuestions();
    //
    const users: IUser[] = [];
    const usersPath = createCollectionPath(this.db, USERS_COLLECTION_PATH);
    const usersQuerySnapshot = await getDocs(usersPath);
    await Promise.all(
      usersQuerySnapshot.docs.map(async (one) => {
        const userData = one.data();
        const email = userData.email;
        const openProfileRef = userData.open_profile_ref;
        //
        const [path, ...rest] = pathConverterFromSlashToList(openProfileRef);
        const openProfile = await getDoc(doc(this.db, path, ...rest));
        const openProfileData = await openProfile.data();
        //
        const props: IUser = {
          id: one.id,
          email: email,
          displayName: openProfileData?.display_name,
        };
        users.push(props);
      })
    );
    return users;
  }

  public async resisterUser(email: string, displayName: string): Promise<void> {
    const openProfileId = uuidV4().toString();
    const openProfileDoc = createDocPath(
      this.db,
      OPEN_PROFILES_COLLECTION_PATH,
      openProfileId
    );
    const openProfileData = {
      display_name: displayName,
    };
    await setDoc(openProfileDoc, openProfileData);

    const userId = uuidV4().toString();
    const userDocRef = createDocPath(this.db, USERS_COLLECTION_PATH, userId);
    const userData = {
      email: email,
      open_profile_ref: openProfileDoc.path,
    };
    await setDoc(userDocRef, userData);
  }
}
