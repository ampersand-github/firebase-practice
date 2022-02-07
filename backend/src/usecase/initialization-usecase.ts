import { OpenProfilesRepository } from "../infrastructure/fireabse/firestore/open-profiles-repository";
import { QuestionsRepository } from "../infrastructure/fireabse/firestore/questions-repository";
import {
  openProfileData1,
  openProfileData2,
  openProfileData3,
  questionData1,
  questionData2,
  questionData3,
} from "../initial-data";

export const initializationFireStoreUsecase = async (
  openProfilesRepository: OpenProfilesRepository,
  questionsRepository: QuestionsRepository
): Promise<void> => {
  // ***** 初期化 *****
  await questionsRepository.deleteAll();
  await openProfilesRepository.deleteAll();

  // ***** 課題を作成 *****
  await questionsRepository.createInitOnly(questionData1);
  await questionsRepository.createInitOnly(questionData2);
  await questionsRepository.createInitOnly(questionData3);

  // ***** オープンプロフィールを作成 *****
  await openProfilesRepository.createInitOnly(openProfileData1);
  await openProfilesRepository.createInitOnly(openProfileData2);
  await openProfilesRepository.createInitOnly(openProfileData3);
};
