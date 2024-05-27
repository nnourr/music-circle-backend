import {
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "../config/globals.js";
import axios from "axios";
import queryString from "query-string";

export class AuthService {
  async getAccessToken(loginCode: string) {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
          code: loginCode,
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
      const { access_token } = response.data;

      return access_token;
    } catch (e) {
      console.error(e);
      throw { error: "Failed to exchange token" };
    }
  }
}
