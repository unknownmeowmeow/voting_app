import express from "express";
import poll from "../Controllers/polls.js"; 

const router = express.Router();

router.post("/create_poll", (req, res) => poll.createPollQuestions(req, res));
router.get("/top_list", (req, res) => poll.getTopPolls(req, res));
router.get("/getnewlist", (req, res) => poll.getNewPolls(req, res));
router.post("/vote", (req, res) => poll.userPollVotes(req, res));
router.get("/:id", (req, res) => poll.getPollId(req, res));
router.get("/result/:id", (req, res) => poll.getPollResult(req, res));

export default router;
