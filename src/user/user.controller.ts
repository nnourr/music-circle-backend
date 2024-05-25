import { Request, Response, Router } from "express";
import queryString from "query-string";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from "../config/globals";

export const userRouter = Router();

userRouter.get("/login", (req: Request, res: Response) => {
  const state = "hdickalporhfsjcys";
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

userRouter.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const client_id = SPOTIFY_CLIENT_ID;
  const client_secret = SPOTIFY_CLIENT_ID;

  if (state === null) {
    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
        client_id: SPOTIFY_CLIENT_ID,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new (Buffer as any).from(
            SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };
  }
});
