// const QuestionFile = require("../models/QuestionFile");
const fs = require("fs");
const path = require("path");
const questionFileService = require("../services/questionFile.service");

async function getAllQuestionFile(req, res, next) {
  try {
    const listQuestionFile = await questionFileService.getAllQuestionFiles();

    return res.status(200).json({
      success: true,
      questionFileRespone: listQuestionFile,
    });
  } catch (error) {
    console.error("Error in getAllQuestionFile:", error);
    next(error);
  }
}

async function getQuestionFilesByUserId(req, res) {
  try {
    const userId = req.params.userId; // Lấy userId từ params hoặc từ req.user nếu có auth
    
    const questionFiles = await questionFileService.getQuestionFileByUserId(
      userId
    );

    res.status(200).json({
      success: true,
      data: questionFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getQuestionFileById(req, res, next) {
  try {
    const { id } = req.params;

    // Gọi service để lấy dữ liệu
    const questionFile = await questionFileService.getQuestionFileById(id);

    if (!questionFile) {
      return res
        .status(404)
        .json({ message: "Question file not found or unauthorized access" });
    }

    return res.status(200).json({ questionFile });
  } catch (error) {
    next(error);
  }
}

async function createQuestionFile(req, res, next) {
  try {
    const newQuestionFile = await questionFileService.createQuestionFile(
      req.body
    );
    res.status(201).json({
      message: "Question File created successfully!",
      result: newQuestionFile,
    });
  } catch (error) {
    console.error("Error creating question file:", error);
    next(error);
  }
}

async function addQuestion(req, res) {
  try {
    const { id } = req.params; // ID của QuestionFile
    const questionData = req.body; // Dữ liệu câu hỏi từ client

    // Gọi service để thêm câu hỏi
    const newQuestion = await questionFileService.addQuestion(id, questionData);

    // Trả về response thành công
    return res.status(201).json({
      success: true,
      message: 'Thêm câu hỏi thành công',
      result: newQuestion,
    });
  } catch (error) {
    console.error('Lỗi khi thêm câu hỏi:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id, questionId } = req.params; // ID của questionFile và questionId

    const updatedQuestionFile = await questionFileService.deleteQuestion(id, questionId);
    res.status(200).json({
      message: 'Question deleted successfully',
      result: updatedQuestionFile,
    });
  } catch (error) {
    console.error('Error deleting question:', error.message);
    res.status(400).json({ message: error.message });
  }
}

async function updateQuestionFile(req, res, next) {
  try {
    const { id } = req.params;
    const updatedQuestionFile = await questionFileService.updateQuestionFile(
      id,
      req.body
    );

    if (!updatedQuestionFile) {
      return res.status(404).json({ message: "Question file not found" });
    }

    res.status(200).json({
      message: "Question file updated successfully",
      result: updatedQuestionFile,
    });
  } catch (error) {
    console.error("Error updating question file:", error);
    next(error);
  }
}

async function deleteQuestionFile(req, res, next) {
  try {
    const { id } = req.params;
    const deletedQuestionFile = await questionFileService.deleteQuestionFile(
      id
    );

    if (!deletedQuestionFile) {
      return res.status(404).json({ message: "Question file not found" });
    }

    res.status(200).json({
      message: "Question file deleted successfully",
      result: deletedQuestionFile,
    });
  } catch (error) {
    console.error("Error deleting question file:", error);
    next(error);
  }
}

async function patchQuestion(req, res) {
  try {
    const { fileId, questionId } = req.params;
    const updatedQuestion = req.body;
    const updatedFile = await questionFileService.updateQuestion(
      fileId,
      questionId,
      updatedQuestion
    );
    res.status(200).json(updatedFile);
  } catch (error) {
    console.error("Lỗi khi cập nhật câu hỏi:", error);
    res.status(error.message.includes("Không tìm thấy") ? 404 : 500).json({
      message: error.message || "Lỗi server",
    });
  }
}

async function updatePrivacy(req, res) {
  try {
    const { fileId } = req.params;
    const { isPrivate } = req.body; // Chỉ lấy isPrivate từ body
    const updatedFile = await questionFileService.updatePrivacy(
      fileId,
      isPrivate
    );
    res
      .status(200)
      .json({ message: "Privacy updated successfully", result: updatedFile });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(error.message.includes("Không tìm thấy") ? 404 : 500).json({
      message: error.message || "Lỗi server",
    });
  }
}
// async function importQuestionFile(req, res) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "Vui lòng upload file .txt" });
//     }

//     const filePath = path.join(__dirname, "../uploads", req.file.filename);
//     const createdBy = req.user ? req.user._id : null;

//     const { data, warnings } =
//       await questionFileService.createQuestionFileFromTxt(filePath, createdBy);

//     fs.unlinkSync(filePath);
//     res.status(201).json({
//       message: "Import học phần thành công",
//       data,
//       warnings: warnings.length > 0 ? warnings : undefined,
//     });
//   } catch (error) {
//     if (req.file)
//       fs.unlinkSync(path.join(__dirname, "../uploads", req.file.filename));
//     res.status(400).json({ error: error.message || "Lỗi khi import file" });
//   }
// }

async function adminGetAllQF(req, res, next) {
  try {
    const listQuestionFile =
      await questionFileService.getAllQuestionFileAndUser();

    return res.status(200).json({
      success: true,
      data: listQuestionFile,
    });
  } catch (error) {
    console.error("Error in getAllQuestionFile:", error);
    next(error);
  }
}
async function findAllByUser(req, res) {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const questionFiles = await questionFileService.getAllQuestionFilesByUser(
      userId
    );

    if (!questionFiles.length) {
      return res.status(404).json({
        success: false,
        message: "No question files found for this user",
      });
    }

    // Không cần transform data vì populate đã xử lý
    res.status(200).json({
      success: true,
      data: questionFiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const QuestionFileController = {
  getAllQuestionFile,
  getQuestionFileById,
  createQuestionFile,
  updateQuestionFile,
  deleteQuestionFile,
  patchQuestion,
  updatePrivacy,
  // importQuestionFile,
  adminGetAllQF,
  getQuestionFilesByUserId,
  findAllByUser,
  addQuestion,
  deleteQuestion
};

module.exports = QuestionFileController;
