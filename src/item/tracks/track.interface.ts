import { ItemInterface } from "../item.interface";

export interface TrackArtist {
  url: string;
  name: string;
}

export interface TrackInterface extends ItemInterface {
  artists: TrackArtist[];
}
