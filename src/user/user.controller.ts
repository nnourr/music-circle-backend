import { Request, Response, Router } from "express";
import { UserService } from "./user.service.js";

export const userRouter = Router();
const userService = new UserService();

userRouter.get("/:token", async (req: Request, res: Response) => {
  try {
    const userInfo = await userService.getUserInfo(req.params.token);
    res.json(userInfo);
  } catch (error: any) {
    res.status(500).json(error);
  }
});

userRouter.get("/:token/artists", async (req: Request, res: Response) => {
  try {
    const userInfo = await userService.getArtists(req.params.token);
    res.json(userInfo);
  } catch (error: any) {
    res.status(500).json(error);
  }
});
