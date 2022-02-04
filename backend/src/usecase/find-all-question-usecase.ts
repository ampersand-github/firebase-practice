import { QuestionsRepository } from "../infrastructure/fireabse/firestore/questions-repository";

export const findAllQuestionUsecase = async (
  questionsRepository: QuestionsRepository
) => {
  return await questionsRepository.findAll();
};
