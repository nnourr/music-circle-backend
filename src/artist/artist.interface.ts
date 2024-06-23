import { Image } from "../spotify/spotify.interface";

export interface ArtistInterface {
  url: string;
  name: string;
  popularity: number;
  genres: string[];
  images: Image[];
}
