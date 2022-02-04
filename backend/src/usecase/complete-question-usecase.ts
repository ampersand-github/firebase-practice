import {
  IOpenProfile,
  IQuestions,
  OpenProfilesRepository,
} from "../infrastructure/fireabse/firestore/open-profiles-repository";

export const completeQuestionUsecase = async (
  openProfile: IOpenProfile,
  questionId: string,
  openProfilesRepository: OpenProfilesRepository
): Promise<void> => {
  // 合致するのがない場合はエラー終了
  const match = openProfile.questions.find((one: IQuestions) => {
    return one.id === questionId;
  });

  if (!match) {
    throw new Error("合致する課題がありません。");
  }

  const updatedQuestion: IQuestions[] = openProfile.questions.map(
    (p: IQuestions) => {
      if (p.id === questionId) {
        return { ...p, status: "完了" };
      }
      return p;
    }
  );

  const ___: IOpenProfile = { ...openProfile, questions: updatedQuestion };
  await openProfilesRepository.update(___);
};
