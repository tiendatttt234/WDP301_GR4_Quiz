const Account = require('../models/Account');
exports.getAllAccounts = async (req, res) => {
    try {
      const accounts = await Account.find();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.createAccount = async (req, res) => {
    try {
      const newAccount = new Account(req.body);
      await newAccount.save();
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.updateAccount = async (req, res) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.deleteAccount = async (req, res) => {
    try {
      await Account.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };