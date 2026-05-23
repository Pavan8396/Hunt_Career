const express = require('express');
const { createReview, getReviewsForEmployer, updateReview } = require('../controllers/reviewController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// Route to create a new review for a specific employer
router.post('/', ensureDb, authenticateToken, createReview);

// Route to update a review
router.put('/:reviewId', ensureDb, authenticateToken, updateReview);

// Route to get all reviews for a specific employer
router.get('/', ensureDb, getReviewsForEmployer);

module.exports = router;
