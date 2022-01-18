import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../init";

export type IErrorText = string | null;
// 新規登録に必要なemailとpasswordのみ受け取る
// authをこの中で依存させることで、firebaseから別のsassに変更になっても
// この関数内を書き換えるだけで良い
export interface ISignup {
  email: string;
  password: string;
}

export const signup = async ({
  email,
  password,
}: ISignup): Promise<IErrorText> => {
  let errorText: IErrorText = null;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
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
      console.log(firebaseError);
      errorText = "something wrong";
    }
  }

  return errorText;
};
