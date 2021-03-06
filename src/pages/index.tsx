import React, { useEffect } from "react";
import { useAuthContext } from "../contexts/use-auth-context";
import { goto } from "../utils/router";

const index = (): JSX.Element => {
  const { user, isLoading, signOut } = useAuthContext();

  useEffect(() => {
    (async () => {
      console.log(user, isLoading);
      // userがnull かつ ローディング完了
      if (!user && !isLoading) {
        await goto("/sign-in"); // todo 定数ページつくってそこに書く
      }
    })();
  }, [user, isLoading]);

  const handleOnClick = async () => {
    /*
    useEffectの第2引数にuserを設定しているので、signOutによって
    userがnullに変化する、
    それによってsign-inページへ遷移する
     */
    await signOut();
  };

  const goToFirestoreSamplePage = async () => {
    await goto("/firestore-sample");
  };
  const goToPrahaFirestorePage = async () => {
    await goto("/praha-firestore");
  };
  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <h1>TopPage</h1>
      <p>{user?.uid}</p>
      <button type="submit" onClick={handleOnClick}>
        logout
      </button>
      <button type="submit" onClick={goToFirestoreSamplePage}>
        FirestoreSample
      </button>
      <button type="submit" onClick={goToPrahaFirestorePage}>
        prahaFirestorePage
      </button>
    </div>
  );
};

export default index;
