import { ArtistInterface } from "../artist/artist.interface.js";

export interface UserInterface {
  username: string;
  email: string;
  teams: string[];
  artists: ArtistInterface[];
}
