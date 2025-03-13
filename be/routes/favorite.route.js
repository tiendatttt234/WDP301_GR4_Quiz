const express = require('express');
const favoriteRouter = express.Router();
const {favoriteController} = require('../controllers');

favoriteRouter.post('/create', favoriteController.createFavorite);

// Get all favorites
favoriteRouter.get('/', favoriteController.getAllFavorites);

// Get favorite by ID
favoriteRouter.get('/:id', favoriteController.getFavorite);

// Get favorites by user ID
favoriteRouter.get('/user/:userId', favoriteController.getUserFavorites);

// Update favorite
favoriteRouter.put('/:id', favoriteController.updateFavorite);

// Delete favorite
favoriteRouter.delete('/delete/:id', favoriteController.deleteFavorite);

module.exports = favoriteRouter;