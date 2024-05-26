import { Request, Response, Router } from "express";
import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";

export const userRouter = Router();
const authService = new AuthService();
const spotifyService = new SpotifyService();
const userRepo = new UserRepo();

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
  let accessToken = "";
  let userInfo: any = {};
  let userArtists: any = {};

  try {
    accessToken = await authService.getAccessToken(loginCode);
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
    return;
  }

  try {
    userInfo = await spotifyService.getUserInfo(accessToken);
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
    return;
  }

  try {
    userArtists = await spotifyService.getArtists(accessToken);
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
    return;
  }

  if (userInfo.email !== email) {
    res.status(400).json("email missmatch");
    return;
  }

  try {
    userRepo.setUser(username, userInfo.email, accessToken, userArtists);
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
    return;
  }

  res.status(200).json({ username: username, email: userInfo.email });
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
