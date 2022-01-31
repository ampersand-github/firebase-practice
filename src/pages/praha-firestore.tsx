import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../infrastructure/firebase/init";
import {
  IUser,
  PrahaFirestoreRepository,
} from "../infrastructure/firebase/firestore/praha-firestore-repository";

const PrahaFirestore = (): JSX.Element => {
  const repository = new PrahaFirestoreRepository(db);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [users, setUsers] = useState<IUser[]>();

  useEffect(() => {
    (async () => {
      const data = await repository.findAll();
      console.log(data);
      setUsers(data);
    })();
  }, []);

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const changeDisplayName = (event: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleCreateUser = async () => {
    await repository.resisterUser(email, displayName);
  };

  return (
    <div>
      <h1>PrahaFirestore</h1>
      <form>
        email:
        <input type="email" onChange={changeEmail} value={email} />
        password:
        <input type="password" onChange={changePassword} value={password} />
        display-name:
        <input type="text" onChange={changeDisplayName} value={displayName} />
        <button type="submit" onClick={handleCreateUser}>
          ユーザー作成
        </button>
        {users?.map((user: IUser) => (
          <li key={user.id}>
            <ul>id:{user.id}</ul>
            <ul>email:{user.email}</ul>
            <ul>displayName:{user.displayName}</ul>
          </li>
        ))}
      </form>
    </div>
  );
};

export default PrahaFirestore;
