import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import users from "./Routes/user_routes.js";
import poll from "./Routes/poll_routes.js";
import { MY_SECRET_SERVER_SESSION } from "./Constant/constants.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: MY_SECRET_SERVER_SESSION, resave: false, saveUninitialized: false }));

app.use("/api/auth", users); 
app.use("/api/polls", poll);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.listen(5000);
