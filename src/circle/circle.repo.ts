import { addDoc } from "firebase/firestore";
import { circleCollection } from "../firebase/firebase.init.js";

export class CircleRepo {
  async addCircle(circleName: string): Promise<string> {
    const result = await addDoc(circleCollection, {
      name: circleName,
    });
    return result.id;
  }
}
