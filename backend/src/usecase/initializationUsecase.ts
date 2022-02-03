import {
  IOpenProfile,
  IQuestions,
  OpenProfilesRepository,
} from "../infrastructure/fireabse/firestore/open-profiles-repository";
import {
  IQuestion,
  QuestionsRepository,
} from "../infrastructure/fireabse/firestore/questions-repository";
import { QuestionStatus, QuestionStatusEnum } from "../question-status";
import { v4 as uuidV4 } from "uuid";

export const initializationFireStoreUsecase = async (
  openProfilesRepository: OpenProfilesRepository,
  questionsRepository: QuestionsRepository
): Promise<void> => {
  // ***** 初期化 *****
  await questionsRepository.deleteAll();
  await openProfilesRepository.deleteAll();

  // ***** 課題を作成 *****
  const questionData1: IQuestion = {
    id: uuidV4().toString(),
    no: 1,
    title: "title1",
    description: "description1",
  };
  const questionData2: IQuestion = {
    id: uuidV4().toString(),
    no: 2,
    title: "title2",
    description: "description2",
  };
  const questionData3: IQuestion = {
    id: uuidV4().toString(),
    no: 3,
    title: "title3",
    description: "description3",
  };
  await questionsRepository.create(questionData1);
  await questionsRepository.create(questionData2);
  await questionsRepository.create(questionData3);

  // ***** オープンプロフィールを作成 *****
  const notFinished = QuestionStatus.create({
    questionStatus: QuestionStatusEnum.notFinished,
  });
  const questions = await questionsRepository.findAll();
  const init: IQuestions[] = questions.map((q) => {
    return { ...q, status: notFinished.QuestionStatus };
  });
  const data1: IOpenProfile = {
    id: uuidV4().toString(),
    displayName: "鈴木一郎",
    questions: init,
  };
  const data2: IOpenProfile = {
    id: uuidV4().toString(),
    displayName: "田中次郎",
    questions: init,
  };
  const data3: IOpenProfile = {
    id: uuidV4().toString(),
    displayName: "佐藤三郎",
    questions: init,
  };
  await openProfilesRepository.create(data1);
  await openProfilesRepository.create(data2);
  await openProfilesRepository.create(data3);
};
