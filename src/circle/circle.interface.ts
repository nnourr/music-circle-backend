import { UserInterface } from "../user/user.interface";

export interface CircleInterface {
  circleName: string;
}

export interface CircleWithUserInfoInterface {
  circleId: string;
  circleName: string;
  users: UserInterface[];
}
