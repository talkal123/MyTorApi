const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  businessId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
