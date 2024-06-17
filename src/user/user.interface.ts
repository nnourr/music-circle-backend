import { ArtistInterface } from "../artist/artist.interface.js";

export interface UserInterface {
  username: string;
  userId: string;
  artists: ArtistInterface[];
}

export interface UserInterfaceWithCircles {
  username: string;
  userId: string;
  circles: string[];
  artists: ArtistInterface[];
}
