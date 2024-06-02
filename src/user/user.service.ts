import { SpotifyUserInfoResponse } from "@/spotify/spotify.interface.js";
import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";
import { ArtistInterface } from "@/artist/artist.interface.js";
import { UserInterface } from "./user.interface.js";

export class UserService {
  spotifyService = new SpotifyService();
  authService = new AuthService();
  userRepo = new UserRepo();
  async setUser(loginCode: string, email: string, team: string) {
    let accessToken: string;
    let userInfo: SpotifyUserInfoResponse;
    let userArtists: ArtistInterface[];

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
      throw "email missmatch";
    }

    let username = userInfo.display_name;

    if (username === undefined) {
      const parts = email.split("@");
      username = parts[0];
    }

    try {
      await this.userRepo.setUser(
        this.createUser(username, email, [team], userArtists)
      );
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    return { username: username, email: email };
  }

  private createUser(
    username: string,
    email: string,
    teams: string[],
    userArtists: ArtistInterface[]
  ): UserInterface {
    return {
      username: username,
      email: email,
      teams: teams,
      artists: userArtists,
    };
  }
}
