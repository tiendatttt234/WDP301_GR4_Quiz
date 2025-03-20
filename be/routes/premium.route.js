const express = require("express");
const premiumRouter = express.Router();
const {
    getAllPremiumPackages
} = require("../controllers/admin/settingPremium");

premiumRouter.get("/getAllPremiumPackages", getAllPremiumPackages);


module.exports = premiumRouter;
