import { addDoc, doc, getDoc } from "firebase/firestore";
import { circleCollection } from "../firebase/firebase.init.js";
import { CircleInterface } from "./circle.interface.js";
import { NotFoundError } from "../config/config.exceptions.js";

export class CircleRepo {
  async addCircle(circleName: string): Promise<string> {
    const result = await addDoc(circleCollection, {
      circleName: circleName,
    });
    return result.id;
  }

  async getCircle(circleId: string): Promise<CircleInterface> {
    const circleDocument = await getDoc(doc(circleCollection, circleId));
    if (!circleDocument.exists || !!!circleDocument.data()) {
      throw new NotFoundError("Unable to find Circle");
    }
    const circle: CircleInterface = circleDocument.data() as CircleInterface;
    return circle;
  }
}
