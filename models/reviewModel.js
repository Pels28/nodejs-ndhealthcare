const { required } = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: { type: String, required: [true, "Comment is required"] },
    image: {
      type: String,
      required: [false]
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
