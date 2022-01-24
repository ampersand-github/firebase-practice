import { Rank } from "../rank";

export interface IRankRepository {
  findAll(): Promise<Rank[]>;
  // findOne(userId: string): Promise<Rank>;
  update(rank: Rank): Promise<void>;
  create(rank: Rank): Promise<void>;
  remove(rank: Rank): Promise<void>;
}
