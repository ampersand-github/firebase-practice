import admin from "firebase-admin";
import _firestore from "@google-cloud/firestore";
import { OpenProfilesRepository } from "./infrastructure/fireabse/firestore/open-profiles-repository";
import { QuestionsRepository } from "./infrastructure/fireabse/firestore/questions-repository";
import { initializationFireStore } from "./initialization";
import { initFirebaseAdmin } from "./infrastructure/fireabse/init";

async function main() {
  console.log(`***** START MAIN *****`);
  initFirebaseAdmin();
  const db: _firestore.Firestore = admin.firestore();
  const openProfilesRepository = new OpenProfilesRepository(db);
  const questionsRepository = new QuestionsRepository(db);
  await initializationFireStore(openProfilesRepository, questionsRepository);

  console.log(`***** END   MAIN *****`);
}
main().then();
