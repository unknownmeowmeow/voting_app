import express from "express";
import poll from "../Controllers/polls.js"; 

const router = express.Router();

router.post("/create_poll", (req, res) => poll.createQuestion(req, res));
router.get("/top_list", (req, res) => poll.getTopQuestions(req, res));
router.get("/getnewlist", (req, res) => poll.getQuestionList(req, res));
router.post("/vote", (req, res) => poll.userVotes(req, res));
router.get("/:id", (req, res) => poll.getQuestionId(req, res));
router.get("/result/:id", (req, res) => poll.getPollResult(req, res));

export default router;
