import {
  addDoc,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { circleCollection, db } from "../firebase/firebase.init.js";
import {
  CircleInterface,
  CircleWithCodeInterface,
} from "./circle.interface.js";
import { NotFoundError } from "../config/config.exceptions.js";
import { UserInterface } from "../user/user.interface.js";

export class CircleRepo {
  async addCircle(circle: CircleInterface): Promise<string> {
    const result = await addDoc(circleCollection, circle);
    return result.id;
  }

  async addUser(circleCode: string, newUser: UserInterface) {
    runTransaction(db, async (transaction) => {
      const circle = await transaction.get(doc(circleCollection, circleCode));
      if (!circle.exists()) {
        throw new NotFoundError("Unable to find Circle");
      }
      const users: UserInterface[] = circle.data()?.users;
      if (users === undefined) {
        throw "Unexpected error: no users";
      }
      const userIndex = users.findIndex(
        (user) => user.userId === newUser.userId
      );
      if (userIndex !== -1) {
        users[userIndex] = newUser;
      } else {
        users.push(newUser);
      }
      transaction.update(doc(circleCollection, circleCode), { users: users });
    });
  }

  async removeUser(circleCode: string, oldUserId: string) {
    await runTransaction(db, async (transaction) => {
      const circle = await transaction.get(doc(circleCollection, circleCode));
      if (!circle.exists()) {
        throw new NotFoundError("Unable to find Circle");
      }
      const users: UserInterface[] = circle.data()?.users;
      if (users === undefined) {
        throw "Unexpected error: no users";
      }
      const filteredUsers = users.filter((user) => user.userId !== oldUserId);
      if (filteredUsers.length === 0) {
        transaction.delete(doc(circleCollection, circleCode));
        return;
      }
      transaction.update(doc(circleCollection, circleCode), {
        users: filteredUsers,
      });
    });
  }

  async renameCircle(circleCode: string, newCircleName: string) {
    updateDoc(doc(circleCollection, circleCode), {
      circleName: newCircleName,
    });
  }

  async patchCircle(circle: CircleWithCodeInterface) {
    circle.users.forEach((user) => {
      if (user.tracks === undefined) {
        delete user.tracks;
      }
      if (user.userId === undefined) {
        delete user.userId;
      }
      if (user.username === undefined) {
        delete user.username;
      }
    });

    setDoc(doc(circleCollection, circle.circleCode), {
      circleName: circle.circleName,
      users: circle.users,
    });
  }

  async getCircle(circleCode: string): Promise<CircleWithCodeInterface> {
    const circleDocument = await getDoc(doc(circleCollection, circleCode));
    if (!circleDocument.exists || !!!circleDocument.data()) {
      throw new NotFoundError("Unable to find Circle");
    }
    const rawCircle: CircleInterface = circleDocument.data() as CircleInterface;
    return {
      circleName: rawCircle.circleName,
      circleCode: circleCode,
      users: rawCircle.users,
    } satisfies CircleWithCodeInterface;
  }
}
