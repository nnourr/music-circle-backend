import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";

export class UserService {
  spotifyService = new SpotifyService();
  authService = new AuthService();
  userRepo = new UserRepo();
  async setUser(loginCode: string, email: string, username: string) {
    let accessToken = "";
    let userInfo: any = {};
    let userArtists: any = {};

    try {
      accessToken = await this.authService.getAccessToken(loginCode);
    } catch (error: any) {
      console.log(error);
      throw error;
    }

    try {
      userInfo = await this.spotifyService.getUserInfo(accessToken);
    } catch (error: any) {
      console.log(error);
      throw error;
    }

    try {
      userArtists = await this.spotifyService.getArtists(accessToken);
    } catch (error: any) {
      console.log(error);
      throw error;
    }

    if (userInfo.email !== email) {
      throw { error: "email missmatch" };
    }

    try {
      this.userRepo.setUser(username, userInfo.email, accessToken, userArtists);
    } catch (error: any) {
      console.log(error);
      throw error;
    }

    return { username: username, email: userInfo.email };
  }
}
