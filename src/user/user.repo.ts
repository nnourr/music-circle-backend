import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { userCollection } from "../firebase/firebase.init.js";
import { UserInterface } from "./user.interface.js";

export class UserRepo {
  async setUser(user: UserInterface) {
    try {
      await setDoc(doc(userCollection, user.email), user, { merge: true });
    } catch (error) {
      throw error;
    }
  }
}
