const Favorite = require('../models/Favorite');


    async function createFavorite(favoriteData) {
        return await Favorite.create(favoriteData);
    }

    async function findById(id) {
        return await Favorite.findById(id)
            .populate('user', 'userName email')
            .populate('sharedQuestionFile');
    }

    async function findAll() {
        return await Favorite.find()
            .populate('user', 'userName email')
            .populate('sharedQuestionFile');
    }

    async function findByUserId(userId) {
        try {
            const favorites = await Favorite.find({ user: userId })
                .populate('user', 'username email') // Populate user của Favorite (nếu cần)
                .populate({
                    path: 'sharedQuestionFile', // Populate mảng sharedQuestionFile
                    populate: {
                        path: 'createdBy', // Populate trường createBy trong QuestionFile
                        model: 'Account', // Tham chiếu đến model Account
                        select: 'userName' // Chỉ lấy trường username
                    },
                    select: 'name arrayQuestion createdBy'
                });
            return favorites;
        } catch (error) {
            console.error('Lỗi khi tìm danh sách favorite:', error);
            throw error;
        }
    }

    async function updateFavorite(id, favoriteData) {
        return await Favorite.findByIdAndUpdate(id, favoriteData, { new: true })
            .populate('user', 'userName email')
            .populate('sharedQuestionFile');
    }

    async function deleteFavorite(id) {
        return await Favorite.findByIdAndDelete(id);
    }


module.exports = {
createFavorite, deleteFavorite,findAll, findById,findByUserId, updateFavorite
}