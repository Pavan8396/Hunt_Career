const Review = require('../models/reviewModel');
const Employer = require('../models/employerModel');

// @desc    Create a new review
// @route   POST /api/employers/:employerId/reviews
// @access  Private (User)
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const employerId = req.params.employerId;
    const userId = req.user._id;

    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Optional: Check if the user has already reviewed this company
    const existingReview = await Review.findOne({ employer: employerId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this company' });
    }

    const review = new Review({
      employer: employerId,
      user: userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for an employer
// @route   GET /api/employers/:employerId/reviews
// @access  Public
exports.getReviewsForEmployer = async (req, res) => {
  try {
    const employerId = req.params.employerId;
    const reviews = await Review.find({ employer: employerId }).populate('user', 'firstName lastName');

    if (!reviews) {
      return res.status(404).json({ message: 'No reviews found for this employer' });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
