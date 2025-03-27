// routes/search.js
const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

router.get('/all', SearchController.searchAll);
router.get('/question-files', SearchController.searchQuestionFiles);
router.get('/users', SearchController.searchUsers);
router.get('/users/:userId', SearchController.searchUserById);

module.exports = router;