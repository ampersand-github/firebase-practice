import { deleteDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { RANKING_COLLECTION_PATH } from "../../../constant/firestore";
import { Rank } from "../../../domain/rank/rank";
import { RankId } from "../../../domain/rank/rank-id";
import { IRank } from "../../../domain/rank/interface/rank-interface";

import { IRankRepository } from "../../../domain/rank/interface/rank-repository";
import { DocumentReference, Firestore } from "@firebase/firestore";
import { createDocPath } from "./__shared__/create-document-path";
import { createCollectionPath } from "./__shared__/create-collection-path";

export class RankRepository implements IRankRepository {
  private readonly db: Firestore;

  public constructor(db: Firestore) {
    this.db = db;
  }

  // - - - - - 更新系共通処理 - - - - - - - - - - - - - - - - - - - -
  private readonly createDocPathForCommand = (
    rank: Rank
  ): DocumentReference => {
    return createDocPath(this.db, RANKING_COLLECTION_PATH, rank.id.toString());
  };

  // - - - - - 処理 - - - - - - - - - - - - - - - - - - - -
  public async findAll(): Promise<Rank[]> {
    const ranking: Rank[] = [];
    const rankingPath = createCollectionPath(this.db, RANKING_COLLECTION_PATH);
    const querySnapshot = await getDocs(rankingPath);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const props: IRank = {
        uid: data.uid,
        point: data.point,
        name: data.name,
      };
      const rankId = RankId.reBuild(doc.id);
      const rank = Rank.reBuild(props, rankId);
      ranking.push(rank);
    });
    return ranking;
  }

  public update = async (rank: Rank): Promise<void> => {
    const docRef = this.createDocPathForCommand(rank);
    await updateDoc(docRef, {
      uid: rank.uid,
      point: rank.point,
      name: rank.name,
    });
  };

  public create = async (rank: Rank): Promise<void> => {
    const docRef = this.createDocPathForCommand(rank);
    await setDoc(docRef, {
      uid: rank.uid,
      point: rank.point,
      name: rank.name,
    });
  };

  public remove = async (rank: Rank): Promise<void> => {
    const docRef = this.createDocPathForCommand(rank);
    await deleteDoc(docRef);
  };
}
