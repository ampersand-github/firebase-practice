import {
  IOpenProfile,
  OpenProfilesRepository,
} from "../infrastructure/fireabse/firestore/open-profiles-repository";
import {
  IQuestion,
  QuestionsRepository,
} from "../infrastructure/fireabse/firestore/questions-repository";
import { QuestionStatus, QuestionStatusEnum } from "../question-status";

export const questionData1: IQuestion = {
  id: "bbd4c88a-6d2c-6ae0-3ca8-13f4544cd656",
  no: 1,
  title: "title1",
  description: "description1",
};
export const questionData2: IQuestion = {
  id: "53e4e935-a398-a6ad-6094-5c54df95a4a8",
  no: 2,
  title: "title2",
  description: "description2",
};
export const questionData3: IQuestion = {
  id: "7c6f5fe3-bb07-747c-6082-acbdeaa1da02",
  no: 3,
  title: "title3",
  description: "description3",
};

const notFinished = QuestionStatus.create({
  questionStatus: QuestionStatusEnum.notFinished,
});

export const openProfileData1: IOpenProfile = {
  id: "32656a0f-336d-d17f-03d4-d60b05dc1947",
  displayName: "鈴木一郎",
  questions: [
    { ...questionData1, status: notFinished.questionStatus },
    { ...questionData2, status: notFinished.questionStatus },
    { ...questionData3, status: notFinished.questionStatus },
  ],
};

export const openProfileData2: IOpenProfile = {
  id: "c971fc94-368d-3b9c-f9c5-a6d99e6c661f",
  displayName: "田中次郎",
  questions: [
    { ...questionData1, status: notFinished.questionStatus },
    { ...questionData2, status: notFinished.questionStatus },
    { ...questionData3, status: notFinished.questionStatus },
  ],
};

export const openProfileData3: IOpenProfile = {
  id: "03d87aff-5434-c03b-4147-a9ea698b06bc",
  displayName: "佐藤三郎",
  questions: [
    { ...questionData1, status: notFinished.questionStatus },
    { ...questionData2, status: notFinished.questionStatus },
    { ...questionData3, status: notFinished.questionStatus },
  ],
};

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
