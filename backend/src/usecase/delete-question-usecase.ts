import {
  IQuestion,
  QuestionsRepository,
} from "../infrastructure/fireabse/firestore/questions-repository";

export const deleteQuestionUseCase = async (
  question: IQuestion,
  questionsRepository: QuestionsRepository
) => {
  await questionsRepository.deleteOne(question);
};
