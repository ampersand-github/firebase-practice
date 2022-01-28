import React, { ChangeEvent, useEffect, useState } from "react";
import { IErrorText, ISign, useAuthContext } from "../contexts/auth";
import { goto } from "../utils/router";

const SignUpPage = (): JSX.Element => {
  const [errText, setErrTest] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, isLoading, signUp } = useAuthContext();

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
    const signUpProps: ISign = {
      email: email,
      password: password,
    };
    // signInが成功するとuseEffectが動いてトップページへ遷移する
    // 成功しなかった場合はこのページが再度表示される
    const errorText: IErrorText = await signUp(signUpProps);
    setErrTest(errorText);
  };

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
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
