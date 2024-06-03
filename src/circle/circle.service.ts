import { CircleRepo } from "./circle.repo.js";

const circleRepo = new CircleRepo();
export class CircleService {
  async newCircle(circleName: string): Promise<string> {
    return await circleRepo.addCircle(circleName);
  }
}
