import {
  IQuestion,
  QuestionsRepository,
} from "../infrastructure/fireabse/firestore/questions-repository";

export const updateQuestionUsecase = async (
  questionId: IQuestion,
  questionsRepository: QuestionsRepository
) => {
  await questionsRepository.update(questionId);
};
