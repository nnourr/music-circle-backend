import { Request, Response, Router } from "express";
import { CircleService } from "./circle.service.js";
import { NotFoundError } from "../config/config.exceptions.js";

export const circleRouter = Router();
const circleService = new CircleService();
circleRouter.post("/:circle_name", async (req: Request, res: Response) => {
  const circleName = req.params.circle_name;
  try {
    res.json(await circleService.newCircle(circleName)).send();
  } catch (error) {
    const response = { error: error, reason: "failed to create new circle" };
    console.error(response);
    res.status(500).json(response).send();
  }
});

circleRouter.get("/:circle_id", async (req: Request, res: Response) => {
  const circleId = req.params.circle_id;
  try {
    res.json(await circleService.getCircleWithUsers(circleId)).send();
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});
