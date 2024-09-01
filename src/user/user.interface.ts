import { TrackInterface } from "../tracks/track.interface.js";
import { ArtistInterface } from "../artist/artist.interface.js";

export interface UserInterface {
  username: string;
  userId: string;
  artists: ArtistInterface[];
  tracks: TrackInterface[];
  images: string[];
}

export interface UserInterfaceWithCircles extends UserInterface {
  circles: string[];
}
