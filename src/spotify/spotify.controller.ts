import axios from "axios";
import { Request, Response, Router } from "express";
import { SpotifyService } from "./spotify.service";

export const spotifyRouter = Router();
const spotifyService = new SpotifyService();

spotifyRouter.get("/:token/artists", async (req: Request, res: Response) => {
  try {
    const artists = await spotifyService.getArtists(req.params.token);
    res.json(artists);
  } catch (error: any) {
    res.status(401).json(error);
  }
});
