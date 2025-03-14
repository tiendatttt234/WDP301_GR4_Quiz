const {favoriteRepository} = require('../repositories/index')

async function createFavorite(favoriteData) {
    try {
        const favorite = await favoriteRepository.createFavorite(favoriteData);
        return {
            success: true,
            data: favorite,
            message: 'Favorite created successfully'
        };
    } catch (error) {
        throw new Error(`Failed to create favorite: ${error.message}`);
    }
}

async function getFavoriteById(id) {
    try {
        const favorite = await favoriteRepository.findById(id);
        if (!favorite) {
            throw new Error('Favorite not found');
        }
        return {
            success: true,
            data: favorite
        };
    } catch (error) {
        throw new Error(`Failed to get favorite: ${error.message}`);
    }
}

async function getAllFavorites() {
    try {
        const favorites = await favoriteRepository.findAll();
        return {
            success: true,
            data: favorites
        };
    } catch (error) {
        throw new Error(`Failed to get favorites: ${error.message}`);
    }
}

async function getFavoritesByUser(userId) {
    try {
        const favorites = await favoriteRepository.findByUserId(userId);
        return {
            success: true,
            data: favorites
        };
    } catch (error) {
        throw new Error(`Failed to get user favorites: ${error.message}`);
    }
}

async function updateFavorite(id, favoriteData) {
    try {
        const favorite = await favoriteRepository.updateFavorite(id, favoriteData);
        if (!favorite) {
            throw new Error('Favorite not found');
        }
        return {
            success: true,
            data: favorite,
            message: 'Favorite updated successfully'
        };
    } catch (error) {
        throw new Error(`Failed to update favorite: ${error.message}`);
    }
}

async function deleteFavorite(id) {
    try {
        const favorite = await favoriteRepository.deleteFavorite(id);
        if (!favorite) {
            throw new Error('Favorite not found');
        }
        return {
            success: true,
            message: 'Favorite deleted successfully'
        };
    } catch (error) {
        throw new Error(`Failed to delete favorite: ${error.message}`);
    }
}

module.exports = {
    createFavorite, deleteFavorite, getAllFavorites, getFavoriteById, getFavoritesByUser, updateFavorite
}