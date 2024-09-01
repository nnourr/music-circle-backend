import { Request, Response, Router } from "express";
import { CircleService } from "./circle.service.js";
import { NotFoundError } from "../config/config.exceptions.js";

export const circleRouter = Router();
const circleService = new CircleService();
circleRouter.post("/:circle_name", async (req: Request, res: Response) => {
  const circleName = req.params.circle_name;
  try {
    const response = await circleService.newCircle(circleName);
    res.json(response).send();
  } catch (error) {
    const response = { error: error, reason: "failed to create new circle" };
    console.error(response);
    res.status(500).json(response).send();
  }
});

circleRouter.patch("/:circle_code", async (req: Request, res: Response) => {
  const circleCode = req.params.circle_code;
  const newCircleName = req.body.newCircleName;

  if (!!!newCircleName) {
    res.status(400).send();
  }

  try {
    await circleService.renameCircle(circleCode, newCircleName);
    res.send();
  } catch (error) {
    const response = { error: error, reason: "failed to create new circle" };
    console.error(response);
    res.status(500).json(response);
  }
});

circleRouter.get("/:circle_id", async (req: Request, res: Response) => {
  const circleCode = req.params.circle_id;
  try {
    const response = await circleService.getCircleWithUsers(circleCode);
    res.json(response);
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }
});
