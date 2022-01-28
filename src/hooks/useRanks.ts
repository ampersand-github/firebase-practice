import { useEffect, useState } from "react";
import { Rank } from "../domain/rank/rank";
import { RankRepository } from "../infrastructure/firebase/firestore/ranking-repository";
import { db } from "../infrastructure/firebase/init";
import { IRank } from "../domain/rank/interface/rank-interface";
import { RankId } from "../domain/rank/rank-id";

/*
CustomHooks層の自分的まとめ
- CustomHooks層はコントローラー層 + ユースケース層の役割を負う
  - ユースケース層つくらない理由は面倒くさいから。
  - ユースケースが複雑になるならユースケース層を作っても良い
- viewは必ずこのCustomHooks層を経由する
  - ロジックで受け取る型はプリミティブ型で受け取ること
  - ドメインオブジェクト型で受け取ってはならない。
  - viewはドメインオブジェクトを知っているべきではない
 */

export const useRanking = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [ranking, setRanking] = useState<Rank[]>([]);
  const repository = new RankRepository(db);

  useEffect(() => {
    findAll();
  }, []);

  const findAll = async (): Promise<void> => {
    setLoading(true);
    // todo 認証済みユーザーのデータを取得する場合はここでuidをもらってくる
    const ranks: Rank[] = await repository.findAll();
    setRanking(ranks);
    setLoading(false);
  };
  // ドメインオブジェクトのRankで受け取らずにIRank型で受け取る
  const update = async (rank: IRank, id: string): Promise<void> => {
    setLoading(true);
    const target = Rank.reBuild(rank, RankId.reBuild(id));
    await repository.update(target);
    await findAll();
    setLoading(false);
  };

  const create = async (rank: IRank): Promise<void> => {
    setLoading(true);
    const target = Rank.reBuild(rank, RankId.create());
    await repository.create(target);
    await findAll();
    setLoading(false);
  };
  const remove = async (rank: IRank, id: string): Promise<void> => {
    setLoading(true);
    const target = Rank.reBuild(rank, RankId.reBuild(id));
    await repository.remove(target);
    await findAll();
    setLoading(false);
  };
  return {
    isLoading: isLoading,
    ranks: ranking,
    update: update,
    create: create,
    remove: remove,
  };
};
