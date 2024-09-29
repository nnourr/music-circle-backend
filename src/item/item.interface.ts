import { Image } from "../spotify/spotify.interface";

export interface ItemInterface {
  url: string;
  name: string;
  popularity: number;
  images: Image[];
}
