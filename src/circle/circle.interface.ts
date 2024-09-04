import { UserInterface } from "../user/user.interface";

export interface CircleInterface {
  circleName: string;
  users: UserInterface[];
}

export interface CircleWithCodeInterface {
  circleCode: string;
  circleName: string;
  users: UserInterface[];
}
