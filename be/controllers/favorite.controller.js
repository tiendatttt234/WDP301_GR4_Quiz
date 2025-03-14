const {favoriteService} = require('../services')

async function createFavorite(req, res) {
    try {
        const favoriteData = {
            user: req.body.user,
            sharedQuestionFile: req.body.sharedQuestionFile
        };
        const result = await favoriteService.createFavorite(favoriteData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getFavorite(req, res) {
    try {
        const result = await favoriteService.getFavoriteById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

async function getAllFavorites(req, res) {
    try {
        const result = await favoriteService.getAllFavorites();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getUserFavorites(req, res) {
    try {
        const result = await favoriteService.getFavoritesByUser(req.params.userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function updateFavorite(req, res) {
    try {
        const result = await favoriteService.updateFavorite(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteFavorite(req, res) {
    try {
        const result = await favoriteService.deleteFavorite(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createFavorite, deleteFavorite, getAllFavorites,getFavorite,getUserFavorites,updateFavorite
}