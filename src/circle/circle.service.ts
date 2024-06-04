import {
  CircleInterface,
  CircleWithUserInfoInterface as CircleWithUsersInterface,
} from "./circle.interface.js";
import { CircleRepo } from "./circle.repo.js";
import { UserInterface } from "../user/user.interface.js";
import { UserService } from "../user/user.service.js";

const circleRepo = new CircleRepo();
const userService = new UserService();
export class CircleService {
  async newCircle(circleName: string): Promise<string> {
    return await circleRepo.addCircle(circleName);
  }

  async getCircle(circleId: string): Promise<CircleInterface> {
    return await circleRepo.getCircle(circleId);
  }

  async getCircleWithUsers(
    circleId: string
  ): Promise<CircleWithUsersInterface> {
    const circleInfo: CircleInterface = await circleRepo.getCircle(circleId);
    const userInfo: UserInterface[] = await userService.getUsersInCircle(
      circleId
    );

    const circleWithUsers: CircleWithUsersInterface = {
      circleId: circleId,
      circleName: circleInfo.circleName,
      users: userInfo,
    };

    return circleWithUsers;
  }
}
