import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../init";

export type IErrorText = string | null;
// 新規登録に必要なemailとpasswordのみ受け取る
// authをこの中で依存させることで、firebaseから別のsassに変更になっても
// この関数内を書き換えるだけで良い
export interface ISignIn {
  email: string;
  password: string;
}

export const signIn = async ({
  email,
  password,
}: ISignIn): Promise<IErrorText> => {
  let errorText: IErrorText = null;

  try {
    await signInWithEmailAndPassword(auth, email, password);
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
      console.log(firebaseError);
      errorText = "something wrong";
    }
  }

  return errorText;
};
