const express = require('express');
const router = express.Router();
const { getAllAccounts, createAccount, updateAccount, deleteAccount } = require('../controllers/accountController');

router.get('/', getAllAccounts);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;