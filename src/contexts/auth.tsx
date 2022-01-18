import React, {
  createContext,
  ReactChild,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../infrastructure/firebase/init";

// undefinedが初期値になる。ログインしているならUser、していないならnull
export interface IAuthContext {
  user: User | null | undefined;
}
const defaultValue: IAuthContext["user"] = undefined;

const AuthContext = createContext<IAuthContext>({
  user: defaultValue,
});

export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const [user, setUser] = useState<User | null | undefined>(defaultValue);

  useEffect(() => {
    // todo ここでauthが依存しているが良いのか？状態管理だから良いのか？
    const unsubscribed = onAuthStateChanged(auth, (user: User | null) => {
      // ログイン状態が変化すると呼ばれる
      setUser(user);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user: user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
