import { SpotifyUserInfoResponse } from "../spotify/spotify.interface.js";
import { AuthService } from "../auth/auth.service.js";
import { SpotifyService } from "../spotify/spotify.service.js";
import { UserRepo } from "./user.repo.js";
import { ArtistInterface } from "../item/artist/artist.interface.js";
import { UserInterface, UserInterfaceWithCircles } from "./user.interface.js";
import { CircleRepo } from "../circle/circle.repo.js";
import { CircleWithCodeInterface } from "../circle/circle.interface.js";
import { TrackInterface } from "../item/tracks/track.interface.js";
import { NotFoundError } from "../config/config.exceptions.js";
import { ItemInterface } from "../item/item.interface.js";

export class UserService {
  spotifyService = new SpotifyService();
  authService = new AuthService();
  userRepo = new UserRepo();
  circleRepo = new CircleRepo();
  async setUser(loginCode: string) {
    let accessToken: string;
    let userInfo: SpotifyUserInfoResponse;
    let userArtists: ArtistInterface[];
    let userTracks: TrackInterface[];

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

    try {
      userTracks = await this.spotifyService.getTracks(accessToken);
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

    // migrate users still saved by email
    try {
      const emailUserWithCircles: UserInterfaceWithCircles =
        await this.getUserWithCircles(userInfo.email);
      userCircles.push(...emailUserWithCircles.circles);
      this.deleteUser(userInfo.email);
    } catch {}

    const completeUser: UserInterfaceWithCircles = this.createUser(
      username,
      userInfo.id,
      userCircles,
      userArtists,
      userTracks,
      userInfo.images.map((imageData) => imageData.url)
    );

    try {
      const existingUser = await this.userRepo.getUserWithCircles(
        completeUser.userId || ""
      );
      completeUser.circles = existingUser.circles;
      if (
        !this.itemsEqual(existingUser.artists, completeUser.artists) ||
        !this.itemsEqual(existingUser.tracks || [], completeUser.tracks || [])
      ) {
        await this.userRepo.setUser(completeUser);

        existingUser.circles.map(async (circleCode) => {
          await this.circleRepo.setUser(circleCode, completeUser);
        });
      }
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
      await this.userRepo.setUser(completeUser);
    }

    return {
      username: username,
      userId: userInfo.id,
      userCircles: completeUser.circles,
    };
  }

  async deleteUser(userId: string) {
    this.userRepo.deleteUser(userId);
  }

  async addUserToCircle(userId: string, circleCode: string) {
    const user = await this.userRepo.getUser(userId);
    this.circleRepo.setUser(circleCode, user);
    this.userRepo.addUserToCircle(userId, circleCode);
  }

  async removeUserFromCircle(userId: string, circleCode: string) {
    this.circleRepo.removeUser(circleCode, userId);
    this.userRepo.removeUserFromCircle(userId, circleCode);
  }

  async patchUser(user: UserInterfaceWithCircles) {
    this.userRepo.setUser(user);
  }

  getUserWithCircles(userId: string) {
    return this.userRepo.getUserWithCircles(userId);
  }

  getUser(userId: string) {
    return this.userRepo.getUser(userId);
  }

  async getUserCircles(userId: string): Promise<CircleWithCodeInterface[]> {
    const rawUser = await this.getUserWithCircles(userId);
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
    userArtists: ArtistInterface[],
    userTracks: TrackInterface[],
    userImages: string[]
  ): UserInterfaceWithCircles {
    return {
      username: username,
      userId: userId,
      circles: circles,
      artists: userArtists,
      tracks: userTracks,
      images: userImages,
    };
  }

  private itemsEqual(items1: ItemInterface[], items2: ItemInterface[]) {
    return (
      items1.length == items2.length &&
      items1.every((element, index) => {
        return element.name === items2[index].name;
      })
    );
  }
}
