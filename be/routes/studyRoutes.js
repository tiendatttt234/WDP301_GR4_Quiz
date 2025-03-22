const express = require("express");
const { getStudySession, submitAnswer, endRound } = require("../controllers/studyController");

const router = express.Router();

router.get("/study/:questionFileId", getStudySession);
router.post("/study/answer", submitAnswer);
router.post("/study/end-round/:questionFileId", endRound);

module.exports = router;