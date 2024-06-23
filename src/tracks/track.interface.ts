import { Image, SpotifyTrackArtist } from "../spotify/spotify.interface";

export interface TrackArtist {
  url: string;
  name: string;
}

export interface TrackInterface {
  url: string;
  name: string;
  popularity: number;
  artists: TrackArtist[];
  images: Image[];
}
