import { Request, Response, Router } from "express";
import { SpotifyService } from "./spotify.service.js";

export const spotifyRouter = Router();
const spotifyService = new SpotifyService();

spotifyRouter.get("/:token/artists", async (req: Request, res: Response) => {
  console.info(`Spotify Controller: Getting User Artists`);
  try {
    const artists = await spotifyService.getArtists(req.params.token);
    res.json(artists);
  } catch (error: any) {
    res.status(500).json(error);
  }
});

spotifyRouter.get("/:token", async (req: Request, res: Response) => {
  console.info(`Spotify Controller: Getting User Info`);
  try {
    const userInfo = await spotifyService.getUserInfo(req.params.token);
    res.json(userInfo);
  } catch (error: any) {
    res.status(500).json(error);
  }
});
