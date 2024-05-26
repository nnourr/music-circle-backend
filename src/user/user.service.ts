import { SpotifyService } from "@/spotify/spotify.service";
import axios from "axios";

export class UserService {
  spotifyService = new SpotifyService();
  async getUserInfo(access_token: string) {
    try {
      return this.spotifyService.getUserInfo(access_token);
    } catch (error: any) {
      throw error;
    }
  }

  async getArtists(access_token: string) {
    try {
      return this.spotifyService.getArtists(access_token);
    } catch (error: any) {
      throw error;
    }
  }
}
