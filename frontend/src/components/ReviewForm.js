import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ employerId, token, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      toast.error('Please provide a rating and a comment.');
      return;
    }
    setSubmitting(true);
    try {
      // The actual API call will be implemented in the parent component
      // This is just the UI component
      await onReviewSubmitted({ rating, comment });
      setRating(0);
      setComment('');
      toast.success('Thank you for your review!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
          <div className="flex">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className="cursor-pointer"
                    color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                    size={30}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 mb-2">Your Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            rows="4"
            placeholder="Share your experience with this company..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
