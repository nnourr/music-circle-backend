import { ArtistInterface } from "../artist/artist.interface.js";

export interface UserInterface {
  username: string;
  email: string;
  artists: ArtistInterface[];
}

export interface UserInterfaceWithCircles {
  username: string;
  email: string;
  circles: string[];
  artists: ArtistInterface[];
}
