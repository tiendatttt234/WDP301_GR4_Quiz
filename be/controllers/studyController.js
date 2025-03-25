const StudyService = require("../services/studyService");

exports.getStudySession = async (req, res) => {
  try {
    const { questionFileId } = req.params;
    const userId = req.payload ? req.payload.user.id : "guest";
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const result = await StudyService.getStudySession(userId, questionFileId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getStudySession:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { questionFileId, questionId, selectedAnswers } = req.body;
    const userId = req.payload ? req.payload.user.id : "guest";

    const result = await StudyService.submitAnswer(userId, questionFileId, questionId, selectedAnswers);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.endRound = async (req, res) => {
  try {
    const { questionFileId } = req.params;
    const userId = req.payload ? req.payload.user.id : "guest";

    const result = await StudyService.endRound(userId, questionFileId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.resetStudySession = async (req, res) => {
  try {
    const { questionFileId } = req.params;
    const userId = req.payload ? req.payload.user.id : "guest";

    const result = await StudyService.resetStudySession(userId, questionFileId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};