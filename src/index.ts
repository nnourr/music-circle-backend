// src/index.js
import express from "express";
import { Express, Request, Response } from "express";
import { authRouter } from "./auth/auth.controller.js";
import { spotifyRouter } from "./spotify/spotify.controller.js";
import { userRouter } from "./user/user.controller.js";
import cors from "cors";
import { circleRouter } from "./circle/circle.controller.js";

export const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/circle", circleRouter);
app.use("/spotify", spotifyRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
