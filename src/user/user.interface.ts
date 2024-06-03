import { ArtistInterface } from "../artist/artist.interface.js";

export interface UserInterface {
  username: string;
  email: string;
  circles: string[];
  artists: ArtistInterface[];
}
