import axios from "axios";
import {
  SpotifyArtistInterface,
  SpotifyTopArtistsResponse,
  SpotifyUserInfoResponse,
} from "./spotify.interface.js";
import { ArtistInterface } from "../artist/artist.interface.js";

export class SpotifyService {
  async getArtists(access_token: string): Promise<ArtistInterface[]> {
    try {
      const artistsResponse = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=50",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + access_token,
          },
        }
      );
      const spotifyArtists: SpotifyTopArtistsResponse = artistsResponse.data;
      return spotifyArtists.items.map((artist) =>
        this.spotifyArtistToArtist(artist)
      );
    } catch (error: any) {
      throw error;
    }
  }

  async getUserInfo(access_token: string): Promise<SpotifyUserInfoResponse> {
    try {
      const userInfoResponse = await axios.get(
        "https://api.spotify.com/v1/me/",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + access_token,
          },
        }
      );
      const userInfo: SpotifyUserInfoResponse = userInfoResponse.data;
      return userInfo;
    } catch (error: any) {
      throw error;
    }
  }

  private spotifyArtistToArtist(
    spotifyArtist: SpotifyArtistInterface
  ): ArtistInterface {
    const artist: ArtistInterface = {
      url: spotifyArtist.external_urls.spotify,
      name: spotifyArtist.name,
      popularity: spotifyArtist.popularity,
      genres: spotifyArtist.genres,
      images: spotifyArtist.images,
    };
    return artist;
  }
}
