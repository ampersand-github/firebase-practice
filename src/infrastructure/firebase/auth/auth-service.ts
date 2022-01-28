// https://qiita.com/stin_dev/items/7d147307c596219f6815
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { signOut as firebaseSignOut } from "@firebase/auth";
import { FirebaseError } from "firebase/app";

type IObserver = (user: FirebaseUser | null) => void;
export type IErrorText = string | null;
export interface ISign {
  email: string;
  password: string;
}

export class AuthService {
  private readonly auth: Auth;

  public constructor(auth: Auth) {
    this.auth = auth;
  }

  // authのproviderの中のuseEffectの中で使う
  public onAuthStateChanged = (observer: IObserver) => {
    firebaseOnAuthStateChanged(this.auth, observer);
  };

  public signOut = async (): Promise<void> => {
    await firebaseSignOut(this.auth);
  };

  public signIn = async (props: ISign): Promise<IErrorText> => {
    let errorText = null;
    try {
      await signInWithEmailAndPassword(this.auth, props.email, props.password);
    } catch (e) {
      if (!(e instanceof FirebaseError)) {
        errorText = "something wrong";
      }
      const firebaseError = e as FirebaseError;
      if (firebaseError.code === "auth/invalid-email") {
        errorText = "メールアドレスの形式が正しくありません";
      } else if (firebaseError.code === "auth/wrong-password") {
        errorText = "パスワードが誤っています";
      } else if (firebaseError.code === "auth/user-not-found") {
        errorText = "ユーザーが存在しません";
      } else {
        errorText = "something wrong";
      }
    }
    return errorText;
  };

  public signUp = async (props: ISign): Promise<IErrorText> => {
    let errorText = null;
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        props.email,
        props.password
      );
    } catch (e) {
      if (!(e instanceof FirebaseError)) {
        errorText = "something wrong";
      }
      const firebaseError = e as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        errorText = "すでに使用されているメールアドレスです";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorText = "メールアドレスの形式が正しくありません";
      } else {
        errorText = "something wrong";
      }
    }
    return errorText;
  };
}
