import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { userCollection } from "../firebase/firebase.init.js";

export class UserRepo {
  async setUser(username: string, email: string, team: string, artists: any) {
    try {
      await setDoc(
        doc(userCollection, email),
        {
          username: username,
          email: email,
          artists: artists,
          teams: arrayUnion(team),
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  }
}
