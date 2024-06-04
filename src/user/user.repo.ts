import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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
    const userDocument = await getDoc(doc(userCollection, email));
    if (!userDocument.exists || userDocument.data() === undefined) {
      throw new NotFoundError(`user ${email} not found`);
    }
    const user: UserInterface = userDocument.data() as UserInterface;

    return user;
  }

  async getUsersInCircle(circleId: string) {
    const usersInCircle: UserInterface[] = [];
    const usersInCircleSnapshot = await getDocs(
      query(userCollection, where("circles", "array-contains", circleId))
    );
    if (usersInCircleSnapshot.empty) {
      throw new NotFoundError(`no users found for circle ${circleId}`);
    }

    usersInCircleSnapshot.forEach((doc) => {
      usersInCircle.push(doc.data() as UserInterface);
    });

    return usersInCircle;
  }
}
