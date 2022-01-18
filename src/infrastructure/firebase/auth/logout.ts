import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../init";

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};