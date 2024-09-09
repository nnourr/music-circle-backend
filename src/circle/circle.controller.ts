import { Request, Response, Router } from "express";
import { CircleService } from "./circle.service.js";
import { NotFoundError } from "../config/config.exceptions.js";

export const circleRouter = Router();
const circleService = new CircleService();
circleRouter.post("/:circle_name", async (req: Request, res: Response) => {
  const circleName = req.params.circle_name;
  const userID = req.body.userID;
  if (!!!userID) {
    res.status(400).send();
    return;
  }
  try {
    const response = await circleService.newCircle(circleName, userID);
    res.json(response);
  } catch (error) {
    const response = { error: error, reason: "failed to create new circle" };
    console.error(response);
    res.status(500).json(response);
  }
});

circleRouter.patch("/:circle_code", async (req: Request, res: Response) => {
  const circleCode = req.params.circle_code;
  const newCircleName = req.body.newCircleName;

  if (!!!newCircleName) {
    res.status(400).send();
    return;
  }

  try {
    await circleService.renameCircle(circleCode, newCircleName);
    res.status(200).send();
    return;
  } catch (error) {
    const response = { error: error, reason: "failed to create new circle" };
    console.error(response);
    res.status(500).json(response);
  }
});

circleRouter.get("/:circle_id", async (req: Request, res: Response) => {
  const circleCode = req.params.circle_id;
  try {
    const response = await circleService.getCircle(circleCode);
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

circleRouter.get("/:circle_id/name", async (req: Request, res: Response) => {
  const circleCode = req.params.circle_id;
  try {
    const response = await circleService.getCircle(circleCode);
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
