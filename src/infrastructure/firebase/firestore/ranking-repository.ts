import { deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { VERSION } from "../../../constant/firestore/verison";
import { Rank } from "../../../domain/rank/rank";
import { RankId } from "../../../domain/rank/rank-id";
import { IRank } from "../../../domain/rank/interface/rank-interface";
import { createCollectionPath } from "./__shared__/create-connection-path";
import { IRankRepository } from "../../../domain/rank/interface/rank-repository";
import { DocumentReference, Firestore } from "@firebase/firestore";
import { db } from "../init";

export class RankRepository implements IRankRepository {
  private readonly firestoreClient: Firestore;

  public constructor(firestoreClient: Firestore) {
    this.firestoreClient = firestoreClient;
  }

  private static readonly createDocPath = (rank: Rank): DocumentReference => {
    return doc(
      db,
      VERSION.version,
      VERSION.docId,
      "ranking",
      rank.id.toString()
    );
  };

  public async findAll(): Promise<Rank[]> {
    const ranking: Rank[] = [];
    // todo 定数としてもっているversionはどうするか？依存してよい？外部から与える？
    // todo これprivateにしても良いかも？
    const rankingPath = createCollectionPath(this.firestoreClient, VERSION, [
      "ranking",
    ]);

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
    const docRef = RankRepository.createDocPath(rank);
    await updateDoc(docRef, {
      uid: rank.uid,
      point: rank.point,
      name: rank.name,
    });
  };

  public create = async (rank: Rank): Promise<void> => {
    const docRef = RankRepository.createDocPath(rank);
    await setDoc(docRef, {
      uid: rank.uid,
      point: rank.point,
      name: rank.name,
    });
  };
  public remove = async (rank: Rank): Promise<void> => {
    const docRef = RankRepository.createDocPath(rank);
    await deleteDoc(docRef);
  };
}
