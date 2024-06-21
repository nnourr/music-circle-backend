import {
  CircleInterface,
  CircleWithCodeInterface,
  CircleWithUserInfoInterface as CircleWithUsersInterface,
} from "./circle.interface.js";
import { CircleRepo } from "./circle.repo.js";
import { UserInterface } from "../user/user.interface.js";
import { UserService } from "../user/user.service.js";

const circleRepo = new CircleRepo();
const userService = new UserService();
export class CircleService {
  async newCircle(circleName: string): Promise<string> {
    return circleRepo.addCircle(circleName);
  }

  async renameCircle(circleCode: string, circleName: string) {
    circleRepo.renameCircle(circleCode, circleName);
  }

  async getCircle(circleCode: string): Promise<CircleWithCodeInterface> {
    return circleRepo.getCircle(circleCode);
  }

  async getCircleWithUsers(
    circleCode: string
  ): Promise<CircleWithUsersInterface> {
    const circleInfo: CircleInterface = await circleRepo.getCircle(circleCode);
    const userInfo: UserInterface[] = await userService.getUsersInCircle(
      circleCode
    );

    const circleWithUsers: CircleWithUsersInterface = {
      circleCode: circleCode,
      circleName: circleInfo.circleName,
      users: userInfo,
    };

    return circleWithUsers;
  }
}
