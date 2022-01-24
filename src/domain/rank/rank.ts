import { AggregateRoot } from "../__shared__/aggregate-root";
import { RankId } from "./rank-id";
import { IRank } from "./interface/rank-interface";

export class Rank extends AggregateRoot<IRank, RankId> {
  public static create(props: IRank): Rank {
    return new Rank(props, RankId.create());
  }

  public static reBuild(props: IRank, id: RankId): Rank {
    return new Rank(props, id);
  }

  public get uid(): IRank["uid"] {
    return this.props.uid;
  }

  public get point(): IRank["point"] {
    return this.props.point;
  }

  public get name(): IRank["name"] {
    return this.props.name;
  }
}
