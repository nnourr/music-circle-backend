import { Request, Response, Router } from "express";
import { TeamService } from "./team.service.js";

export const teamRouter = Router();
const teamService = new TeamService();
teamRouter.post("/:team_name", async (req: Request, res: Response) => {
  const teamName = req.params.team_name;
  try {
    res.json(await teamService.newTeam(teamName)).send();
  } catch (error) {
    const response = { error: error, reason: "failed to create new team" };
    console.error(response);
    res.status(500).json(response).send();
  }
});
