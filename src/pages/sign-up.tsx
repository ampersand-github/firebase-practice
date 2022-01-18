import React, { ChangeEvent, useLayoutEffect, useState } from "react";
import { IAuthContext, useAuthContext } from "../contexts/auth";
import {
  IErrorText,
  ISignup,
  signup,
} from "../infrastructure/firebase/auth/sign-up";
import { useRouter } from "next/router";

// このページにアクセスしたときにuserの初期値はログイン状態に関わらずundefinedが格納されている
// その後すぐにuserにはUserかnullの型が格納される。
// もし型がUserだった場合ログイン済みなのでこのページは表示させずにトップページへ遷移したい。
// しかしuserの状態がundefinedからUserへ変化するため、undefined中の一瞬、画面が表示される。
// その後すぐに遷移するが、それが一瞬のチラツキになる。
// それを解決するためにundefinedであれば、</>を表示するようにした
const SignUpPage = (): JSX.Element => {
  const [errText, setErrTest] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user }: { user: IAuthContext["user"] } = useAuthContext();

  // useEffectと違い、useLayoutは画面が表示される前に実行
  useLayoutEffect(() => {
    // ログイン済みならtopページへ
    if (user) {
      router.push({
        pathname: "/",
      });
    }
    // ログインしていない
    if (user === null) {
      setLoading(false);
    }
  }, [user]); // [user]は初回アクセス時とuserが変化する度に実行

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const signUpProps: ISignup = {
      email: email,
      password: password,
    };
    const errorText: IErrorText = await signup(signUpProps);
    setErrTest(errorText);
  };

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  // todo componentsに移動する
  return loading ? (
    <></>
  ) : (
    <div>
      <h1>ユーザ登録 {user?.email}</h1>
      <p>{errText}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          メールアドレス:
          <input
            name="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={changeEmail}
          />
        </label>
        <label htmlFor="password">
          パスワード:
          <input
            name="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={changePassword}
          />
        </label>
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default SignUpPage;
