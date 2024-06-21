import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
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

  async renameCircle(circleCode: string, newCircleName: string) {
    updateDoc(doc(circleCollection, circleCode), {
      circleName: newCircleName,
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
    } satisfies CircleWithCodeInterface;
  }
}
