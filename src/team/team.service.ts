import { TeamRepo } from "./team.repo";

const teamRepo = new TeamRepo();
export class TeamService {
  async newTeam(teamName: string): Promise<string> {
    return await teamRepo.addTeam(teamName);
  }
}
