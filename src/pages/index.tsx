import React, { useEffect } from "react";
import { useAuthContext } from "../contexts/auth";
import { goto } from "../utils/router";

const index = (): JSX.Element => {
  const { user, isLoading, signOut } = useAuthContext();

  useEffect(() => {
    (async () => {
      // userがnull かつ ローディング完了
      if (!user && !isLoading) {
        await goto("/sign-in"); // todo 定数ページつくってそこに書く
      }
    })();
  }, [user, isLoading]);

  const handleOnClick = async () => {
    await signOut();
    // useEffectの第2引数にuserを設定しているので、signOutによって
    // userがnullに変化する、
    // それによってsign-inページへ遷移する
  };

  const goToFirestoreSamplePage = async () => {
    await goto("/firestore-sample");
  };

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <h1>TopPage</h1>
      <button type="submit" onClick={handleOnClick}>
        logout
      </button>
      <button type="submit" onClick={goToFirestoreSamplePage}>
        FirestoreSample
      </button>
    </div>
  );
};

export default index;
