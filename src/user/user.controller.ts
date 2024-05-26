import axios from "axios";
import { Request, Response, Router } from "express";

export const userRouter = Router();

userRouter.get("/:token/artists", async (req: Request, res: Response) => {
  try {
    const artists = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + req.params.token,
        },
      }
    );
    res.json({ artists: artists.data });
  } catch (error: any) {
    res.status(401).json(error);
  }
});
