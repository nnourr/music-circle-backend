import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { userCollection } from "../firebase/firebase.init.js";
import { UserInterface } from "./user.interface.js";

export class UserRepo {
  async setUser(user: UserInterface) {
    try {
      await setDoc(
        doc(userCollection, user.email),
        {
          ...user,
          circles: arrayUnion(...user.circles),
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async addUserToCircle(email: string, circleCode: string) {
    try {
      await updateDoc(doc(userCollection, email), {
        circles: arrayUnion(circleCode),
      });
    } catch (error) {
      throw error;
    }
  }

  async getUser(email: string) {
    try {
      const userDocument = await getDoc(doc(userCollection, email));
      if (!userDocument.exists || userDocument.data() === undefined) {
        throw { error: "user not found" };
      }
      const user: UserInterface = userDocument.data() as UserInterface;

      return user;
    } catch (error) {
      throw error;
    }
  }
}
