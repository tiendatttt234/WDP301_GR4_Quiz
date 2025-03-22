const express = require("express");
const { getStudySession, submitAnswer, endRound, resetStudySession } = require("../controllers/studyController");

const router = express.Router();

router.get("/:questionFileId", getStudySession);
router.post("/submit", submitAnswer);
router.post("/end-round/:questionFileId", endRound);
router.post("/reset/:questionFileId", resetStudySession);
module.exports = router;