const Review = require("../models/reviewModel")
const dbConnect = require("../lib/dbConnect")
const {validateReview} = require("../middlewares/validator")
const {sendReviewAdminNotification} = require("../utils/email")

exports.getAllReviews = async (req, res) => {
  try {
    await dbConnect();
    
    // Get page number from query params, default to 1 if not provided
    const page = parseInt(req.query.page) || 1;
    // Number of reviews per page
    const limit = 5;
    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get total count of reviews for pagination info
    const totalReviews = await Review.countDocuments();
    const totalPages = Math.ceil(totalReviews / limit);

    // Get paginated reviews
    const reviews = await Review.find()
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalReviews,
      totalPages,
      currentPage: page,
      data: reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    await dbConnect();
    const { name, location, rating, comment, image } = req.body;

    const { error } = validateReview({ name, location, rating, comment, image });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    const newReview = await Review.create({
      name,
      location,
      rating,
      comment,
      image,
    });

    // Send admin notification only
    await sendReviewAdminNotification(newReview.toObject());

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}