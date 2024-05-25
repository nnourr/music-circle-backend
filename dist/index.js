// src/index.js
import express from "express";
import dotenv from "dotenv";
import queryString from "query-string";
dotenv.config();
export const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
var client_id = process.env.SPOTIFY_CLIENT_ID;
var redirect_uri = "http://localhost:3000/callback";
app.get("/user/login", (req, res) => {
    var state = "hdickalporhfsjcys";
    var scope = "user-read-private user-read-email";
    res.redirect("https://accounts.spotify.com/authorize?" +
        queryString.stringify({
            response_type: "code",
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        }));
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
