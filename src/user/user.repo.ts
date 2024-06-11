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
import {
  UserInterface,
  UserInterfaceWithCircles as UserWithCirclesInterface,
} from "./user.interface.js";
import { NotFoundError } from "../config/config.exceptions.js";

export class UserRepo {
  async setUser(user: UserWithCirclesInterface) {
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
      const updatedDoc = await updateDoc(doc(userCollection, email), {
        circles: arrayUnion(circleCode),
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserWithCircles(email: string) {
    const userDocument = await getDoc(doc(userCollection, email));
    if (!userDocument.exists || userDocument.data() === undefined) {
      throw new NotFoundError(`user ${email} not found`);
    }
    const user: UserWithCirclesInterface =
      userDocument.data() as UserWithCirclesInterface;

    return user;
  }

  async getUsersInCircle(circleCode: string): Promise<UserInterface[]> {
    const usersInCircle: UserInterface[] = [];
    const usersInCircleSnapshot = await getDocs(
      query(userCollection, where("circles", "array-contains", circleCode))
    );
    if (usersInCircleSnapshot.empty) {
      throw new NotFoundError(`no users found for circle ${circleCode}`);
    }

    usersInCircleSnapshot.forEach((doc) => {
      const user = doc.data() as UserWithCirclesInterface;
      usersInCircle.push({
        username: user.username,
        email: user.email,
        artists: user.artists,
      });
    });

    return usersInCircle;
  }
}
