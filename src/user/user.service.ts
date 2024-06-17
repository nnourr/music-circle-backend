import { SpotifyUserInfoResponse } from "../spotify/spotify.interface.js";
import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";
import { ArtistInterface } from "../artist/artist.interface.js";
import { UserInterface, UserInterfaceWithCircles } from "./user.interface.js";
import { CircleRepo } from "../circle/circle.repo.js";
import { CircleWithCodeInterface } from "../circle/circle.interface.js";

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

    const userCircles: string[] = [];

    try {
      const emailUserWithCircles: UserInterfaceWithCircles = await this.getUser(
        userInfo.email
      );
      userCircles.push(...emailUserWithCircles.circles);
      this.deleteUser(userInfo.email);
    } catch {}

    try {
      await this.userRepo.setUser(
        this.createUser(username, userInfo.id, userCircles, userArtists)
      );
    } catch (error: any) {
      console.error(error);
      throw error;
    }

    return { username: username, userId: userInfo.id };
  }

  async deleteUser(userId: string) {
    this.userRepo.deleteUser(userId);
  }

  async addUserToCircle(userId: string, circleCode: string) {
    await this.circleRepo.getCircle(circleCode);
    this.userRepo.addUserToCircle(userId, circleCode);
  }

  async removeUserFromCircle(userId: string, circleCode: string) {
    this.userRepo.removeUserFromCircle(userId, circleCode);
  }

  getUser(userId: string) {
    return this.userRepo.getUserWithCircles(userId);
  }

  async getUserCircles(userId: string): Promise<CircleWithCodeInterface[]> {
    const rawUser = await this.getUser(userId);
    const circleCodes = rawUser.circles;
    if (circleCodes === null) {
      return [];
    }
    const undefinedCircles = await Promise.all(
      circleCodes.map((circleCode) => {
        try {
          return this.circleRepo.getCircle(circleCode);
        } catch (_) {
          return undefined;
        }
      })
    );
    const circles = undefinedCircles.filter((circle) => circle !== undefined);
    return circles as CircleWithCodeInterface[];
  }

  getUsersInCircle(circleCode: string): Promise<UserInterface[]> {
    return this.userRepo.getUsersInCircle(circleCode);
  }

  private createUser(
    username: string,
    userId: string,
    circles: string[],
    userArtists: ArtistInterface[]
  ): UserInterfaceWithCircles {
    return {
      username: username,
      userId: userId,
      circles: circles,
      artists: userArtists,
    };
  }
}
