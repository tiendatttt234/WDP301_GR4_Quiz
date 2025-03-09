const AccountRepository = require("../../repositories/Account.repository");
const Account = require("../../models/Account");
const Role = require("../../models/Role");
const Quiz = require('../../models/Quiz');

async function getAllAccounts(req, res) {
    try {
        const accounts = await AccountRepository.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function islockAccount(req, res) {
    try {
        const { id } = req.params;
        const account = await AccountRepository.getAccountById(id);
        if (!account) return res.status(404).json({ message: "Tài khoản không tồn tại" });

        account.isLocked = !account.isLocked;
        await account.save();

        res.json({
            message: `Tài khoản ${account.isLocked ? "đã bị khóa" : "đã được mở khóa"}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

const getDashboardStats = async (req, res) => {
    try {
        const adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) return res.status(500).json({ message: "Không tìm thấy role admin" });

        const adminRoleId = adminRole._id;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const totalUsers = await Account.countDocuments({ roles: { $ne: adminRoleId } });
        const totalUsersLastWeek = await Account.countDocuments({
            createdAt: { $lt: oneWeekAgo },
            roles: { $ne: adminRoleId }
        });
        const totalUsersChange = calculatePercentageChange(totalUsers, totalUsersLastWeek);

        const newUsersThisWeek = await Account.countDocuments({
            createdAt: { $gte: oneWeekAgo },
            roles: { $ne: adminRoleId }
        });
        const newUsersLastWeek = await Account.countDocuments({
            createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
            roles: { $ne: adminRoleId }
        });
        const newUsersChange = calculatePercentageChange(newUsersThisWeek, newUsersLastWeek);

        const totalQuizzes = await Quiz.countDocuments();
        const totalQuizzesChange = 8.3;

        const totalPremiumUsers = await Account.countDocuments({ isPrime: true });
        const previousWeekPremiumUsers = await Account.countDocuments({
            isPrime: true,
            createdAt: { $lt: oneWeekAgo }
        });
        const premiumUsersChange = calculatePercentageChange(totalPremiumUsers, previousWeekPremiumUsers);

        return res.status(200).json({
            totalUsers: { count: totalUsers, change: totalUsersChange.toFixed(2) + "%" },
            newUsers: { count: newUsersThisWeek, change: newUsersChange.toFixed(2) + "%" },
            totalQuizzes: { count: totalQuizzes, change: totalQuizzesChange.toFixed(2) + "%" },
            premiumUsers: { count: totalPremiumUsers, change: premiumUsersChange.toFixed(2) + "%" }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    getAllAccounts,
    islockAccount,
    getDashboardStats
};
