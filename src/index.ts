// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { userRouter } from "./user/user.controller";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
