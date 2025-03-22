const Account = require("../../models/Account");
const Role = require("../../models/Role");
const AccountRepository = require("../../repositories/Account.repository");


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

        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            { $set: { isLocked: !account.isLocked } },
            { new: true, runValidators: false }
        );

        res.json({
            message: `Tài khoản ${updatedAccount.isLocked ? "đã bị khóa" : "đã được mở khóa"}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllAccounts,
    islockAccount
};