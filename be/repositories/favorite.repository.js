const Favorite = require('../models/Favorite');


async function createFavorite(favoriteData) {
    const { user, sharedQuestionFile } = favoriteData;
    
    // Tìm document Favorite của user và thêm questionFile ID vào mảng
    const updatedFavorite = await Favorite.findOneAndUpdate(
        { user: user }, // Điều kiện tìm kiếm theo user
        { $push: { sharedQuestionFile: sharedQuestionFile } }, // Thêm ID vào mảng
        { 
            new: true, // Trả về document đã được update
            upsert: true // Nếu không tìm thấy thì tạo mới
        }
    );
    
    return updatedFavorite;
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
                .populate({
                    path: 'user',
                    select: 'username email' // Populate thông tin user của Favorite
                })
                .populate({
                    path: 'sharedQuestionFile', // Populate mảng sharedQuestionFile
                    select: 'name arrayQuestion createdBy', // Lấy các trường cần thiết từ QuestionFile
                    populate: {
                        path: 'createdBy', // Populate trường createdBy trong QuestionFile
                        model: 'Account',
                        select: 'userName' // Đảm bảo tên field đúng với schema Account
                    }
                });

            if (!favorites || favorites.length === 0) {
                return []; // Trả về mảng rỗng nếu không tìm thấy
            }

            return favorites;
        } catch (error) {
            console.error('Error finding favorites by userId:', error);
            throw new Error('Unable to fetch favorites');
        }
    }

    async function updateFavorite(id, favoriteData) {
        return await Favorite.findByIdAndUpdate(id, favoriteData, { new: true })
            .populate('user', 'userName email')
            .populate('sharedQuestionFile');
    }

    async function deleteFavorite(favoriteId, questionFileId) {
        return await Favorite.findByIdAndUpdate(
            favoriteId,
            { $pull: { sharedQuestionFile: questionFileId } },
            { new: true }
        );
    }

module.exports = {
createFavorite, deleteFavorite,findAll, findById,findByUserId, updateFavorite
}