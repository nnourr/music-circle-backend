import {
  CircleInterface,
  CircleWithCodeInterface,
} from "./circle.interface.js";
import { CircleRepo } from "./circle.repo.js";
import { UserInterface } from "../user/user.interface.js";
import { UserService } from "../user/user.service.js";

const circleRepo = new CircleRepo();
const userService = new UserService();
export class CircleService {
  async newCircle(circleName: string, userID: string): Promise<string> {
    const userObj = await userService.getUserWithCircles(userID);
    const newCircleCode = await circleRepo.addCircle({
      circleName: circleName,
      users: [userObj],
    });
    userObj.circles.push(newCircleCode);
    userService.patchUser(userObj);
    return newCircleCode;
  }

  async renameCircle(circleCode: string, circleName: string) {
    circleRepo.renameCircle(circleCode, circleName);
  }

  async getCircle(circleCode: string): Promise<CircleWithCodeInterface> {
    const circle = await circleRepo.getCircle(circleCode);
    if (!!!circle.users) {
      const users = await userService.getUsersInCircle(circleCode);
      circle.users = users;
      circleRepo.patchCircle(circle);
    }
    return circle;
  }
}
