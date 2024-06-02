import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";

export class UserService {
  spotifyService = new SpotifyService();
  authService = new AuthService();
  userRepo = new UserRepo();
  async setUser(loginCode: string, email: string, team: string) {
    let accessToken = "";
    let userInfo: any = {};
    let userArtists: any = {};

    try {
      accessToken = await this.authService.getAccessToken(loginCode);
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    try {
      userInfo = await this.spotifyService.getUserInfo(accessToken);
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    try {
      userArtists = await this.spotifyService.getArtists(accessToken);
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    if (userInfo.email !== email) {
      console.error("email missmatch");
      throw new Error("email missmatch");
    }

    let username = userInfo.display_name;

    if (username === undefined) {
      const parts = email.split("@");
      username = parts[0];
    }

    try {
      await this.userRepo.setUser(username, email, team, userArtists);
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    return { username: username, email: email };
  }
}
