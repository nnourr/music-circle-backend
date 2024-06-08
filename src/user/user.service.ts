import { SpotifyUserInfoResponse } from "@/spotify/spotify.interface.js";
import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";
import { ArtistInterface } from "@/artist/artist.interface.js";
import { UserInterface } from "./user.interface.js";
import { CircleRepo } from "../circle/circle.repo.js";
import { NotFoundError } from "@/config/config.exceptions.js";

export class UserService {
  spotifyService = new SpotifyService();
  authService = new AuthService();
  userRepo = new UserRepo();
  circleRepo = new CircleRepo();
  async setUser(loginCode: string) {
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

    let username = userInfo.display_name;

    if (username === undefined) {
      const parts = userInfo.email.split("@");
      username = parts[0];
    }

    try {
      await this.userRepo.setUser(
        this.createUser(username, userInfo.email, [], userArtists)
      );
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    return { username: username, email: userInfo.email };
  }

  async addUserToCircle(email: string, circleCode: string) {
    await this.circleRepo.getCircle(circleCode);
    this.userRepo.addUserToCircle(email, circleCode);
  }

  getUser(email: string) {
    return this.userRepo.getUser(email);
  }

  getUsersInCircle(circleId: string): Promise<UserInterface[]> {
    return this.userRepo.getUsersInCircle(circleId);
  }

  private createUser(
    username: string,
    email: string,
    circles: string[],
    userArtists: ArtistInterface[]
  ): UserInterface {
    return {
      username: username,
      email: email,
      circles: circles,
      artists: userArtists,
    };
  }
}
