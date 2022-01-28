import React, {
  createContext,
  ReactChild,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "../infrastructure/firebase/init";
import { signOut as firebaseSignOut } from "@firebase/auth";
import { FirebaseError } from "firebase/app";

// undefinedが初期値になる。ログインしているならUser、していないならnull
// todo ここでUser型(firebase)を使っては行けない。なぜならviewが依存してしまうから。
// todo uid,emailなど必要な情報だけ送るべし
export type IErrorText = string | null;
export interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  signIn: (props: ISign) => Promise<IErrorText>;
  signUp: (props: ISign) => Promise<IErrorText>;
  signOut: () => void;
}
const defaultValue: IAuthContext = {
  user: null,
  isLoading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: () => {},
};
const AuthContext = createContext<IAuthContext>(defaultValue);

// 新規登録に必要なemailとpasswordのみ受け取る
// authをこの中で依存させることで、firebaseから別のsassに変更になっても
// この関数内を書き換えるだけで良い
export interface ISign {
  email: string;
  password: string;
}

// todo この中の各authのロジックをシングルトンのクラスにしたい
export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const [user, setUser] = useState<IAuthContext["user"]>(defaultValue.user);
  const [isLoading, setLoading] = useState<IAuthContext["isLoading"]>(
    defaultValue.isLoading
  );

  useEffect(() => {
    // onAuthStateChangedが非同期なので非同期にしてあげる。
    // そうしないと処理が完了してsetLoading(false)したはずが、ずれて初期値のままsetLoading(false)がはしってしまう
    (async () => {
      await getAuthState();
    })();
  }, []);

  const getAuthState = async () => {
    await onAuthStateChanged(auth, (user: User | null) => {
      // ログイン状態が変化すると呼ばれる
      setLoading(true);
      setUser(user);
      setLoading(false);
    });
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    await firebaseSignOut(auth);
    console.log(`AuthProvider-signOut:${user}`);
    setLoading(false);
  };

  const signIn = async ({ email, password }: ISign): Promise<string | null> => {
    let errorText = null;
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
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

  const signUp = async ({ email, password }: ISign): Promise<string | null> => {
    let errorText = null;
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(result.user);
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

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isLoading: isLoading,
        signIn: signIn,
        signUp: signUp,
        signOut: signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
