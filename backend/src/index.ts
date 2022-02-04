import admin from "firebase-admin";
import _firestore from "@google-cloud/firestore";
import { OpenProfilesRepository } from "./infrastructure/fireabse/firestore/open-profiles-repository";
import {
  IQuestion,
  QuestionsRepository,
} from "./infrastructure/fireabse/firestore/questions-repository";
import { initFirebaseAdmin } from "./infrastructure/fireabse/init";
import {
  initializationFireStoreUsecase,
  openProfileData2,
  questionData1,
  questionData2,
  questionData3,
} from "./usecase/initialization-usecase";
import { deleteQuestionUseCase } from "./usecase/delete-question-usecase";
import { completeQuestionUsecase } from "./usecase/complete-question-usecase";
import { updateQuestionUsecase } from "./usecase/update-question-usecase";
import { findAllQuestionUsecase } from "./usecase/find-all-question-usecase";

async function main() {
  console.log(`***** START MAIN *****`);

  // * * * * * firestore初期設定 * * * * *
  initFirebaseAdmin();
  const db: _firestore.Firestore = admin.firestore();
  const openProfilesRepo = new OpenProfilesRepository(db);
  const questionsRepo = new QuestionsRepository(db);

  // * * * * * firestore初期データ投入 * * * * *
  await initializationFireStoreUsecase(openProfilesRepo, questionsRepo);

  // * * * * * あるユーザの課題ステータスを一覧表示するスクリプトを作成してください * * * * *
  const allQuestion = await findAllQuestionUsecase(questionsRepo);
  console.log(allQuestion);

  // * * * * * 削除したい課題のidを引数に受け取り、課題を削除します。 * * * * *
  // その際、当該課題とユーザーの紐付けも削除するようにしてください
  await deleteQuestionUseCase(questionData1, questionsRepo);

  // * * * * * 特定のユーザーに紐づいた課題を「未完了」から「完了」状態に変更するスクリプトを作成してください * * * * *
  // ユーザーと課題のidを引数に受け取り、当該課題の状態を「完了」に更新してください
  await completeQuestionUsecase(
    openProfileData2,
    questionData2.id,
    openProfilesRepo
  );

  // * * * * * 特定の課題を更新するスクリプトを作成してください * * * * *
  const questionUpdate: IQuestion = { ...questionData3, title: "update3" };
  await updateQuestionUsecase(questionUpdate, questionsRepo);

  await console.log(`***** END   MAIN *****`);
}
main().then();
