import e, { Request, Response, Router } from "express";
import { UserService } from "./user.service.js";
import { UserInterface } from "./user.interface.js";
import { NotFoundError } from "@/config/config.exceptions.js";

export const userRouter = Router();
const userService = new UserService();

userRouter.post("/", async (req: Request, res: Response) => {
  const loginCode = req.body?.loginCode;

  if (loginCode === undefined) {
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
  "/:email/circle/:circleCode",
  async (req: Request, res: Response) => {
    const userEmail = req.params.email;
    const circleCode = req.params.circleCode;

    if (userEmail === undefined || circleCode === undefined) {
      res.status(400).json("Bad request");
      return;
    }

    try {
      await userService.addUserToCircle(userEmail, circleCode);
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

userRouter.get("/:email", async (req: Request, res: Response) => {
  const userEmail = req.params.email;

  if (userEmail === undefined) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    const user: UserInterface = await userService.getUser(userEmail);
    res.status(200).json(user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
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
