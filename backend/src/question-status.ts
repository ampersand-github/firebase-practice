import { ValueObject } from "../../src/domain/__shared__/value-object";
import {} from "./index";

export const QuestionStatusEnum = {
  finished: "完了",
  notFinished: "未完了",
} as const;
export type QuestionStatusType =
  typeof QuestionStatusEnum[keyof typeof QuestionStatusEnum];

export interface QuestionStatusProps {
  questionStatus: string;
}

export class QuestionStatus extends ValueObject<QuestionStatusProps> {
  public get questionStatus() {
    return this.props.questionStatus;
  }

  private constructor(props: QuestionStatusProps) {
    super(props);
  }
  public static create(props: QuestionStatusProps): QuestionStatus {
    if (
      !Object.values(QuestionStatusEnum).includes(
        props.questionStatus as QuestionStatusType
      )
    ) {
      throw new Error("QuestionStatusが不正です。");
    }
    return new QuestionStatus(props);
  }
}
