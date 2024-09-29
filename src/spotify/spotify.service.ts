import axios from "axios";
import {
  SpotifyArtistInterface,
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyTrack,
  SpotifyTrackArtist,
  SpotifyUserInfoResponse,
} from "./spotify.interface.js";
import { ArtistInterface } from "../item/artist/artist.interface.js";
import { TrackArtist, TrackInterface } from "../item/tracks/track.interface.js";

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

  async getTracks(access_token: string): Promise<TrackInterface[]> {
    try {
      const tracksResponseFifty = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?limit=50",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + access_token,
          },
        }
      );
      const tracksResponseHundred = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks??offset=50&limit=50",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + access_token,
          },
        }
      );
      const spotifyTracks: SpotifyTopTracksResponse = tracksResponseFifty.data;
      const spotifyTracksHundred: SpotifyTopTracksResponse =
        tracksResponseHundred.data;
      spotifyTracks.items.push(...spotifyTracksHundred.items);
      return spotifyTracks.items.map((track) =>
        this.spotifyTrackToTrack(track)
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

  private spotifyTrackArtistToTrackArtist(
    spotifyTrackArtist: SpotifyTrackArtist
  ): TrackArtist {
    return {
      url: spotifyTrackArtist.external_urls.spotify,
      name: spotifyTrackArtist.name,
    };
  }

  private spotifyTrackToTrack(spotifyTrack: SpotifyTrack): TrackInterface {
    const track: TrackInterface = {
      url: spotifyTrack.external_urls.spotify,
      name: spotifyTrack.name,
      popularity: spotifyTrack.popularity,
      artists: spotifyTrack.artists.map((artist) =>
        this.spotifyTrackArtistToTrackArtist(artist)
      ),
      images: spotifyTrack.album.images,
    };
    return track;
  }
}
