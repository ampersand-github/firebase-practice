import { v4 as uuid } from "uuid";
import { UniqueEntityId } from "../__shared__/unique-entity-id";

export class RankId extends UniqueEntityId {
  private constructor(value: string) {
    super(value, "RankId");
  }

  public static create(): RankId {
    return new RankId(uuid());
  }

  public static reBuild(value: string): RankId {
    return new RankId(value);
  }
}
