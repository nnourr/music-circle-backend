import { addDoc, doc } from "firebase/firestore";
import { teamCollection } from "../firebase/firebase.init.js";

export class TeamRepo {
  async addTeam(teamName: string): Promise<string> {
    const result = await addDoc(teamCollection, {
      name: teamName,
    });
    return result.id;
  }
}
