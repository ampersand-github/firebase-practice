import React, {
  createContext,
  ReactChild,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "firebase/auth";
import { auth } from "../infrastructure/firebase/init";
import {
  AuthService,
  IErrorText,
  ISign,
} from "../infrastructure/firebase/auth/auth-service";

// undefinedが初期値になる。ログインしているならUser、していないならnull
// todo ここでUser型(firebase)を使っては行けない。なぜならviewが依存してしまうから。
// todo uid,emailなど必要な情報だけ送るべし
export interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  signIn: (props: ISign) => Promise<IErrorText>;
  signUp: (props: ISign) => Promise<IErrorText>;
  signOut: () => Promise<void>;
}

const defaultValue: IAuthContext = {
  user: null,
  isLoading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
};

const AuthContext = createContext<IAuthContext>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const authService = new AuthService(auth);
  const [user, setUser] = useState<IAuthContext["user"]>(defaultValue.user);
  const [isLoading, setLoading] = useState<IAuthContext["isLoading"]>(
    defaultValue.isLoading
  );

  useEffect(() => {
    // onAuthStateChangedが非同期なので非同期にしてあげる。
    // そうしないと処理が完了してsetLoading(false)したはずが、ずれて初期値のままsetLoading(false)がはしってしまう
    (async () => {
      await authService.onAuthStateChanged((user: User | null) => {
        setLoading(true);
        setUser(user);
        setLoading(false);
      });
    })();
  }, []);

  const signOut = async (): Promise<void> => {
    await authService.signOut();
  };

  const signIn = async (props: ISign): Promise<IErrorText> => {
    return await authService.signIn(props);
  };

  const signUp = async (props: ISign): Promise<IErrorText> => {
    return await authService.signUp(props);
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
