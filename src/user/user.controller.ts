import { Request, Response, Router } from "express";
import queryString from "query-string";
import axios from "axios";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from "../config/globals.js";

export const userRouter = Router();

userRouter.get("/login", (req: Request, res: Response) => {
  const state = "hdickalporhfsjcy";
  const scope = "user-top-read";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: state,
      })
  );
});

userRouter.get("/callback", async function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  if (state === null) {
    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          grant_type: "authorization_code",
          client_id: SPOTIFY_CLIENT_ID,
        }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              new (Buffer as any).from(
                SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
              ).toString("base64"),
          },
        }
      );
      const { access_token, refresh_token } = response.data;
      res.json({ access_token, refresh_token });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to exchange token" });
    }
  }
});
