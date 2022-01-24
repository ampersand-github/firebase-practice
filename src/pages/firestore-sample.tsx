import React from "react";
import { useRanking } from "../hooks/useRanks";
import { Rank } from "../domain/rank/rank";
import { IRank } from "../domain/rank/interface/rank-interface";
import { GradesForm } from "../components/grades/grades-form";

const FirestoreSample = (): JSX.Element => {
  const { isLoading, ranks, update, create, remove } = useRanking();
  if (isLoading) return <p>Loading...</p>;

  const updateHandle = (rankData: IRank, id: string) => async () => {
    await update(rankData, id);
  };

  const createHandle = () => async () => {
    const rank: IRank = {
      uid: "5",
      point: 10,
      name: "ズズキ",
    };
    await create(rank);
  };

  const deleteHandle = (rankData: IRank, id: string) => async () => {
    await remove(rankData, id);
  };

  // todo componentsに移動する
  return (
    <div>
      <h1>FirestoreSample</h1>

      {ranks.map((rank: Rank) => {
        return (
          <ul key={rank.id.toString()}>
            <li>{rank.uid}</li>
            <li>{rank.point}</li>
            <li>{rank.name}</li>
            <button
              onClick={updateHandle(
                {
                  uid: rank.uid,
                  point: rank.point * 2,
                  name: rank.name,
                },
                rank.id.toString()
              )}
            >
              update
            </button>
            <button
              onClick={deleteHandle(
                {
                  uid: rank.uid,
                  point: rank.point,
                  name: rank.name,
                },
                rank.id.toString()
              )}
            >
              delete
            </button>
            <li>- - - - - - -</li>
          </ul>
        );
      })}
      <button onClick={createHandle()}>create</button>
      <GradesForm />
    </div>
  );
};

export default FirestoreSample;
