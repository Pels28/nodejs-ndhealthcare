const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const upload = require("../lib/multerConfig");

router.post("/create", upload.single("image"), reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/images/:id", reviewController.getImage)

module.exports = router;
