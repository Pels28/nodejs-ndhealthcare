const Review = require("../models/reviewModel")

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