import express from "express";
import user from "../Controllers/users.js"; 

const router = express.Router();

router.post("/register", (req, res) => user.userRegistrations(req, res));
router.post("/login", (req, res) => user.userLogin(req, res));
router.post("/logout", (req, res) => user.userLogout(req, res));

export default router;
