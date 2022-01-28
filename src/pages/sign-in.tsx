import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ISign, useAuthContext } from "../contexts/auth";
import { goto } from "../utils/router";

const SignInPage = (): JSX.Element => {
  const [errText, setErrText] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, isLoading, signIn } = useAuthContext();

  useEffect(() => {
    (async () => {
      // ログイン済み かつ ローディング完了
      if (user && !isLoading) {
        await goto("/");
      }
    })();
  }, [user, isLoading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const signInProps: ISign = {
      email: email,
      password: password,
    };
    // signInが成功するとuseEffectが動いてトップページへ遷移する
    // 成功しなかった場合はこのページが再度表示される
    const errText = await signIn(signInProps);
    setErrText(errText);
  };

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
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
