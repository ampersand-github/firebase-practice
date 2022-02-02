import {
  IOpenProfile,
  IQuestions,
  OpenProfilesRepository,
} from "./infrastructure/fireabse/firestore/open-profiles-repository";
import {
  IQuestion,
  QuestionsRepository,
} from "./infrastructure/fireabse/firestore/questions-repository";
import { QuestionStatus, QuestionStatusEnum } from "./question-status";

export const initializationFireStore = async (
  openProfilesRepository: OpenProfilesRepository,
  questionsRepository: QuestionsRepository
): Promise<void> => {
  // ***** 課題の初期化 *****
  const questionData1: IQuestion = {
    no: 1,
    title: "title1",
    description: "description1",
  };
  const questionData2: IQuestion = {
    no: 2,
    title: "title2",
    description: "description2",
  };
  const questionData3: IQuestion = {
    no: 3,
    title: "title3",
    description: "description3",
  };

  await questionsRepository.deleteAll();
  await questionsRepository.create(questionData1);
  await questionsRepository.create(questionData2);
  await questionsRepository.create(questionData3);

  // ***** オープンプロフィールの作成 *****
  await openProfilesRepository.deleteAll();
  const notFinished = QuestionStatus.create({
    questionStatus: QuestionStatusEnum.notFinished,
  });
  const questions = await questionsRepository.findAll();
  const init: IQuestions[] = questions.map((q) => {
    return { ...q, status: notFinished.QuestionStatus };
  });
  const data1: IOpenProfile = { displayName: "鈴木一郎", questions: init };
  const data2: IOpenProfile = { displayName: "田中次郎", questions: init };
  const data3: IOpenProfile = { displayName: "佐藤三郎", questions: init };
  await openProfilesRepository.create(data1);
  await openProfilesRepository.create(data2);
  await openProfilesRepository.create(data3);
};
