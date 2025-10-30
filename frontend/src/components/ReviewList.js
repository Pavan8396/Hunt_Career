import React, { useState, useEffect } from 'react';
import { getReviewsForEmployer } from '../services/api';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <FaStar key={index} color={index < rating ? '#ffc107' : '#e4e5e9'} />
      ))}
    </div>
  );
};

const ReviewList = ({ employerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsForEmployer(employerId);
        setReviews(data);
      } catch (error) {
        // Error is already toasted by the api service
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [employerId]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Company Reviews</h3>
      {reviews.length > 0 ? (
        <>
          <div className="mb-4 flex items-center">
            <span className="text-2xl font-bold mr-2">{averageRating}</span>
            <StarRating rating={Math.round(averageRating)} />
            <span className="ml-2 text-gray-600 dark:text-gray-400">({reviews.length} reviews)</span>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="p-4 border rounded dark:bg-gray-700 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{`${review.user.firstName} ${review.user.lastName}`}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No reviews for this company yet.</p>
      )}
    </div>
  );
};

export default ReviewList;
