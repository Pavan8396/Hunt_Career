const Review = require('../models/reviewModel');
const Employer = require('../models/employerModel');
const User = require('../models/userModel');

// @desc    Create a new review
// @route   POST /api/employers/:employerId/reviews
// @access  Private (User)
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const employerId = req.params.employerId;
    const userId = req.user.id;

    const employer = await Employer.findByPk(employerId);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    const existingReview = await Review.findOne({
        where: { employerId, userId }
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this company' });
    }

    const review = await Review.create({
      employerId,
      userId,
      rating,
      comment,
    });

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
    const reviews = await Review.findAll({
      where: { employerId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName'],
      }]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
