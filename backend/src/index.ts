import admin from "firebase-admin";
import _firestore from "@google-cloud/firestore";
import { OpenProfilesRepository } from "./infrastructure/fireabse/firestore/open-profiles-repository";
import { QuestionsRepository } from "./infrastructure/fireabse/firestore/questions-repository";
import { initializationFireStore } from "./initialization";
import { initFirebaseAdmin } from "./infrastructure/fireabse/init";

async function main() {
  console.log(`***** START MAIN *****`);

  // * * * * * firestore初期設定 * * * * *
  initFirebaseAdmin();
  const db: _firestore.Firestore = admin.firestore();
  const openProfilesRepository = new OpenProfilesRepository(db);
  const questionsRepository = new QuestionsRepository(db);

  // * * * * * firestore初期データ投入 * * * * *
  await initializationFireStore(openProfilesRepository, questionsRepository); // 具体的には：削除したい課題のidを引数に受け取り、課題を削除します。その際、当該課題とユーザーの紐付けも削除するようにしてください

  // * * * * * 特定のユーザーに紐づいた課題を「未完了」から「完了」状態に変更するスクリプトを作成してください * * * * *
  // ユーザーと課題のidを引数に受け取り、当該課題の状態を「完了」に更新してください

  // * * * * * 特定の課題を更新するスクリプトを作成してください * * * * *
  /*
  具体的には：更新したい課題のid、タイトル、詳細を引数に受け取り、当該課題を更新してください
  Aさんの所持している課題は更新したけどBさんの所持している課題は更新されていない！といったことがないように、全員の課題を更新しましょう
   */

  // * * * * * 特定の課題を削除するスクリプトを作成してください * * * * *
  console.log(`***** END   MAIN *****`);
}
main().then();
