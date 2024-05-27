import { Request, Response, Router } from "express";
import { UserService } from "./user.service.js";

export const userRouter = Router();
const userService = new UserService();

userRouter.post("/:email", async (req: Request, res: Response) => {
  const email = req.params.email;
  const loginCode = req.body?.loginCode;
  const username = req.body?.username;

  if (
    loginCode === undefined ||
    email === undefined ||
    username === undefined
  ) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    res.status(200).json(await userService.setUser(loginCode, email, username));
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
});

// userRouter.get("/:username", async (req: Request, res: Response) => {
//   const email = req.params.email;
//   try {
//     const userInfo = await userService.getUserInfo(email);
//     res.json(userInfo);
//   } catch (error: any) {
//     res.status(500).json(error);
//   }
// });

// userRouter.get("/:email/artists", async (req: Request, res: Response) => {
//   const email = req.params.email;
//   try {
//     const userInfo = await userService.getArtists(email);
//     res.json(userInfo);
//   } catch (error: any) {
//     res.status(500).json(error);
//   }
// });
