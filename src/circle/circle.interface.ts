import { UserInterface } from "../user/user.interface";

export interface CircleInterface {
  circleName: string;
}

export interface CircleWithCodeInterface {
  circleName: string;
  circleCode: string;
}

export interface CircleWithUserInfoInterface {
  circleCode: string;
  circleName: string;
  users: UserInterface[];
}
