import axios from "axios";

export class SpotifyService {
  async getArtists(access_token: string) {
    try {
      const artists = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + access_token,
          },
        }
      );
      return { artists: artists.data };
    } catch (error: any) {
      throw error;
    }
  }

  async getUserInfo(access_token: string) {
    try {
      const userInfo = await axios.get("https://api.spotify.com/v1/me/", {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + access_token,
        },
      });
      return { user: userInfo.data };
    } catch (error: any) {
      throw error;
    }
  }
}
