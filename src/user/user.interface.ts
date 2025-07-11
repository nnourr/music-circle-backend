import { TrackInterface } from "../item/tracks/track.interface.js";
import { ArtistInterface } from "../item/artist/artist.interface.js";

export interface UserInterface {
  username?: string;
  userId: string;
  artists: ArtistInterface[];
  tracks?: TrackInterface[];
  images: string[];
}

export interface UserInterfaceWithCircles extends UserInterface {
  circles: string[];
}
