import { addDoc, doc, getDoc } from "firebase/firestore";
import { circleCollection } from "../firebase/firebase.init.js";
import {
  CircleInterface,
  CircleWithCodeInterface,
} from "./circle.interface.js";
import { NotFoundError } from "../config/config.exceptions.js";

export class CircleRepo {
  async addCircle(circleName: string): Promise<string> {
    const result = await addDoc(circleCollection, {
      circleName: circleName,
    });
    return result.id;
  }

  async getCircle(
    circleCode: string
  ): Promise<CircleWithCodeInterface | undefined> {
    const circleDocument = await getDoc(doc(circleCollection, circleCode));
    if (!circleDocument.exists || !!!circleDocument.data()) {
      // throw new NotFoundError("Unable to find Circle");
      return;
    }
    const rawCircle: CircleInterface = circleDocument.data() as CircleInterface;
    return {
      circleName: rawCircle.circleName,
      circleCode: circleCode,
    } satisfies CircleWithCodeInterface;
  }
}
