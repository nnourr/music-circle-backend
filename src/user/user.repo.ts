import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
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
        doc(userCollection, user.userId),
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

  async addUserToCircle(userId: string, circleCode: string) {
    updateDoc(doc(userCollection, userId), {
      circles: arrayUnion(circleCode),
    });
  }

  async removeUserFromCircle(userId: string, circleCode: string) {
    updateDoc(doc(userCollection, userId), {
      circles: arrayRemove(circleCode),
    });
  }

  async deleteUser(userId: string) {
    deleteDoc(doc(userCollection, userId));
  }

  async getUserWithCircles(userId: string) {
    const userDocument = await getDoc(doc(userCollection, userId));
    if (!userDocument.exists || userDocument.data() === undefined) {
      throw new NotFoundError(`user ${userId} not found`);
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
        userId: user.userId,
        artists: user.artists,
        tracks: user.tracks,
      });
    });

    return usersInCircle;
  }
}
