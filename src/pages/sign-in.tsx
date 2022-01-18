import React, { ChangeEvent, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import { IErrorText } from "../infrastructure/firebase/auth/sign-up";
import { ISignIn, signIn } from "../infrastructure/firebase/auth/sign-in";
import Link from "next/link";
import { IAuthContext, useAuthContext } from "../contexts/auth";

// このページにアクセスしたときにuserの初期値はログイン状態に関わらずundefinedが格納されている
// その後すぐにuserにはUserかnullの型が格納される。
// もし型がUserだった場合ログイン済みなのでこのページは表示させずにトップページへ遷移したい。
// しかしuserの状態がundefinedからUserへ変化するため、undefined中の一瞬、画面が表示される。
// その後すぐに遷移するが、それが一瞬のチラツキになる。
// それを解決するためにundefinedであれば、</>を表示するようにした
const SignInPage = (): JSX.Element => {
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
    const signInProps: ISignIn = {
      email: email,
      password: password,
    };
    signIn(signInProps).then((errorText: IErrorText) => {
      errorText === null
        ? router.push({
            pathname: "/",
          })
        : setErrTest(errorText);
    });
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
      <h1>ログイン</h1>
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
        <button type="submit">ログイン</button>
      </form>
      <Link href="/sign-up">
        <a>新規登録はこちら</a>
      </Link>
    </div>
  );
};

export default SignInPage;
