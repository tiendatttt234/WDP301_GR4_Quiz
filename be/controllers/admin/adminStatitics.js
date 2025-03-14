const Account = require("../../models/Account");
const Role = require("../../models/Role");
const QuestionFile = require("../../models/QuestionFile");
const Transaction = require("../../models/Transaction");

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

        const totalQuizzes = await QuestionFile.countDocuments();
        const totalQuizzesLastWeek = await QuestionFile.countDocuments({
            createdAt: { $lt: oneWeekAgo }
        });
        const totalQuizzesChange = calculatePercentageChange(totalQuizzes, totalQuizzesLastWeek);

        const totalPremiumUsers = await Account.countDocuments({ isPrime: true, roles: { $ne: adminRoleId } });
        const previousWeekPremiumUsers = await Account.countDocuments({
            isPrime: true,
            createdAt: { $lt: oneWeekAgo },
            roles: { $ne: adminRoleId }
        });
        const premiumUsersChange = calculatePercentageChange(totalPremiumUsers, previousWeekPremiumUsers);

        return res.status(200).json({
            totalUsers: { count: totalUsers, change: formatChange(totalUsersChange) },
            newUsers: { count: newUsersThisWeek, change: formatChange(newUsersChange) },
            totalQuizzes: { count: totalQuizzes, change: formatChange(totalQuizzesChange) },
            premiumUsers: { count: totalPremiumUsers, change: formatChange(premiumUsersChange) }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : current === 0 ? 0 : -100; 
    return ((current - previous) / previous) * 100;
};

const formatChange = (value) => {
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
};

const getUserStatistics = async (req, res) => {
    try {
        const adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) return res.status(500).json({ message: "Không tìm thấy role admin" });

        const adminRoleId = adminRole._id;
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        let month = parseInt(req.query.month) || now.getMonth() + 1;
        let week = parseInt(req.query.week);

        if (!week) {
            const firstDayOfYear = new Date(year, 0, 1);
            const dayOfYear = Math.floor((now - firstDayOfYear) / (1000 * 60 * 60 * 24)) + 1;
            week = Math.ceil(dayOfYear / 7);
        }

        if (month) {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);

            const dailyNewUsers = await Account.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
                        roles: { $ne: adminRoleId }
                    }
                },
                {
                    $group: {
                        _id: { 
                            day: { $dayOfMonth: "$createdAt" },
                            isPrime: "$isPrime"
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.day": 1 } }
            ]);

            const daysInMonth = new Date(year, month, 0).getDate();
            const dailyResult = Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                newUsers: dailyNewUsers.find(s => s._id.day === i + 1 && !s._id.isPrime)?.count || 0,
                newPremiumUsers: dailyNewUsers.find(s => s._id.day === i + 1 && s._id.isPrime)?.count || 0
            }));

            const weeklyData = await getWeeklyData(year, week, adminRoleId);

            return res.status(200).json({
                success: true,
                year,
                month,
                week,
                dailyData: dailyResult,
                weeklyData
            });
        }

        if (week) {
            const weeklyData = await getWeeklyData(year, week, adminRoleId);
            return res.status(200).json({
                success: true,
                year,
                week,
                weeklyData
            });
        }

        return res.status(400).json({ success: false, message: "Thiếu tham số month hoặc week" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getWeeklyData = async (year, week, adminRoleId) => {
    const startOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
  
    const weeklyNewUsers = await Account.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lt: endOfWeek },
          roles: { $ne: adminRoleId }
        }
      },
      {
        $group: {
          _id: { 
            dayOfWeek: { $subtract: [{ $dayOfWeek: "$createdAt" }, 1] },
            isPrime: "$isPrime"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.dayOfWeek": 1 } }
    ]);
  
    const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
    return weekDays.map((day, i) => ({
      day,
      newUsers: weeklyNewUsers.find(s => s._id.dayOfWeek === i && !s._id.isPrime)?.count || 0,
      newPremiumUsers: weeklyNewUsers.find(s => s._id.dayOfWeek === i && s._id.isPrime)?.count || 0
    }));
  };

const getWeeklyQuizData = async (year, week) => {
    const startOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyNewQuizzes = await QuestionFile.aggregate([
        { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
        { 
            $group: { 
                _id: { dayOfWeek: { $subtract: [{ $dayOfWeek: "$createdAt" }, 1] } },
                count: { $sum: 1 }
            } 
        },
        { $sort: { "_id.dayOfWeek": 1 } }
    ]);

    const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
    return weekDays.map((day, i) => ({
        day,
        newQuizzes: weeklyNewQuizzes.find(s => s._id.dayOfWeek === i)?.count || 0
    }));
};

const getQuestionStatistics = async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        let month = parseInt(req.query.month) || now.getMonth() + 1;
        let week = parseInt(req.query.week);

        if (!week) {
            const firstDayOfYear = new Date(year, 0, 1);
            const dayOfYear = Math.floor((now - firstDayOfYear) / (1000 * 60 * 60 * 24)) + 1;
            week = Math.ceil(dayOfYear / 7);
        }

        if (month) {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);

            const dailyNewQuizzes = await QuestionFile.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfMonth, $lt: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: { day: { $dayOfMonth: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.day": 1 } }
            ]);

            const daysInMonth = new Date(year, month, 0).getDate();
            const dailyResult = Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                newQuizzes: dailyNewQuizzes.find(s => s._id.day === i + 1)?.count || 0
            }));

            const weeklyData = await getWeeklyQuizData(year, week);

            return res.status(200).json({
                success: true,
                year,
                month,
                week,
                dailyData: dailyResult,
                weeklyData
            });
        }

        if (week) {
            const weeklyData = await getWeeklyQuizData(year, week);
            return res.status(200).json({
                success: true,
                year,
                week,
                weeklyData
            });
        }

        return res.status(400).json({ success: false, message: "Thiếu tham số month hoặc week" });
    } catch (error) {
        console.error("Error fetching question file statistics:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Thêm hàm phân tích doanh thu
const getRevenueStatistics = async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        let month = parseInt(req.query.month) || now.getMonth() + 1;
        let week = parseInt(req.query.week);

        if (!week) {
            const firstDayOfYear = new Date(year, 0, 1);
            const dayOfYear = Math.floor((now - firstDayOfYear) / (1000 * 60 * 60 * 24)) + 1;
            week = Math.ceil(dayOfYear / 7);
        }

        let query = { status: 'success' };

        if (month) {
            // Thống kê doanh thu theo ngày trong tháng
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);
            query.createdAt = { $gte: startOfMonth, $lt: endOfMonth };

            const dailyRevenue = await Transaction.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: { day: { $dayOfMonth: "$createdAt" } },
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.day": 1 } }
            ]);

            const daysInMonth = new Date(year, month, 0).getDate();
            const dailyResult = Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                revenue: dailyRevenue.find(s => s._id.day === i + 1)?.total || 0,
                transactions: dailyRevenue.find(s => s._id.day === i + 1)?.count || 0
            }));

            // Lấy dữ liệu tuần hiện tại
            const weeklyData = await getWeeklyRevenueData(year, week);

            // Tổng doanh thu trong tháng
            const totalRevenue = await Transaction.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        transactionCount: { $sum: 1 }
                    }
                }
            ]);

            return res.status(200).json({
                success: true,
                year,
                month,
                week,
                totalRevenue: totalRevenue[0]?.total || 0,
                totalTransactions: totalRevenue[0]?.transactionCount || 0,
                dailyData: dailyResult,
                weeklyData
            });
        }

        if (week) {
            const weeklyData = await getWeeklyRevenueData(year, week);
            const totalRevenue = await Transaction.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        transactionCount: { $sum: 1 }
                    }
                }
            ]);

            return res.status(200).json({
                success: true,
                year,
                week,
                totalRevenue: totalRevenue[0]?.total || 0,
                totalTransactions: totalRevenue[0]?.transactionCount || 0,
                weeklyData
            });
        }

        return res.status(400).json({ success: false, message: "Thiếu tham số month hoặc week" });
    } catch (error) {
        console.error("Error fetching revenue statistics:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getWeeklyRevenueData = async (year, week) => {
    const startOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyRevenue = await Transaction.aggregate([
        { $match: { status: 'success', createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
        {
            $group: {
                _id: { dayOfWeek: { $subtract: [{ $dayOfWeek: "$createdAt" }, 1] } },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.dayOfWeek": 1 } }
    ]);

    const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
    return weekDays.map((day, i) => ({
        day,
        revenue: weeklyRevenue.find(s => s._id.dayOfWeek === i)?.total || 0,
        transactions: weeklyRevenue.find(s => s._id.dayOfWeek === i)?.count || 0
    }));
};

module.exports = {
    getDashboardStats,
    getUserStatistics,
    getQuestionStatistics,
    getRevenueStatistics
};