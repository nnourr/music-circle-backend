import { userCollection } from "@/firebase/firebase.init";
import { doc, setDoc } from "firebase/firestore";

export class UserRepo {
  setUser(username: string, email: string, accessCode: string, artists: any) {
    try {
      setDoc(doc(userCollection, email), {
        accessCode: accessCode,
        username: username,
        email: email,
        artists: artists,
      });
    } catch (error) {
      throw error;
    }
  }
}
