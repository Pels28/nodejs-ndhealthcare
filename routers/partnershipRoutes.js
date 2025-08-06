const express = require("express");
const router = express.Router();
const partnershipController = require("../controllers/partnershipController");

router.post("/create", partnershipController.createPartnership);

module.exports = router;