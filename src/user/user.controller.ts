import e, { Request, Response, Router } from "express";
import { UserService } from "./user.service.js";
import { UserInterface } from "./user.interface.js";
import { NotFoundError } from "../config/config.exceptions.js";
import { CircleWithCodeInterface } from "../circle/circle.interface.js";

export const userRouter = Router();
const userService = new UserService();

userRouter.post("/", async (req: Request, res: Response) => {
  const loginCode = req.body?.loginCode;

  if (!!!loginCode) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    res.status(200).json(await userService.setUser(loginCode));
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
    return;
  }
});

userRouter.post(
  "/:userId/circle/:circleCode",
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const circleCode = req.params.circleCode;

    if (!!!userId || !!!circleCode) {
      res.status(400).json("Bad request");
      return;
    }

    try {
      await userService.addUserToCircle(userId, circleCode);
      res.status(200).json();
      return;
    } catch (error) {
      console.error(error);
      const status = error instanceof NotFoundError ? 404 : 500;
      res.status(status).json({ error: error });
      return;
    }
  }
);

userRouter.delete(
  "/:userId/circle/:circleCode",
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const circleCode = req.params.circleCode;

    if (!!!userId || !!!circleCode) {
      res.status(400).json("Bad request");
      return;
    }

    try {
      await userService.removeUserFromCircle(userId, circleCode);
      res.status(200).json();
      return;
    } catch (error) {
      console.error(error);
      const status = error instanceof NotFoundError ? 404 : 500;
      res.status(status).json({ error: error });
      return;
    }
  }
);

userRouter.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!!!userId) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    const user: UserInterface = await userService.getUser(userId);
    res.status(200).json(user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
    return;
  }
});

userRouter.get("/:userId/circles", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!!!userId) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    const userCircles: CircleWithCodeInterface[] =
      await userService.getUserCircles(userId);
    res.status(200).json(userCircles);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
    return;
  }
});
