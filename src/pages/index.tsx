import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import router from "next/router";
import { signOut } from "../infrastructure/firebase/auth/logout";

const index = (): JSX.Element => {
  useEffect(() => {
    // todo 関数に切り分ける必要はあるか？
    getAuth().onAuthStateChanged(async (user) => {
      if (!user) {
        await router.push({
          // todo 定数ページつくってそこに書く
          pathname: "/sign-in",
        });
      }
    });
  }, []);

  const handleOnClick = async () => {
    await signOut();
  };

  // todo componentsに移動する
  return (
    <div>
      <h1>TopPage</h1>
      <button type="submit" onClick={handleOnClick}>
        logout
      </button>
    </div>
  );
};

export default index;
