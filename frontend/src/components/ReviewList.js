import React, { useState, useEffect, useContext } from 'react';
import { getReviewsForEmployer, updateReview } from '../services/api';
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { PencilIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';

const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          color={index < rating ? '#ffc107' : '#e4e5e9'}
          className={interactive ? 'cursor-pointer' : ''}
          onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
        />
      ))}
    </div>
  );
};

const ReviewList = ({ employerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editData, setEditData] = useState({ rating: 0, comment: '' });

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

  useEffect(() => {
    fetchReviews();
  }, [employerId]);

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      await updateReview(employerId, editingReviewId, editData, token);
      toast.success('Review updated successfully!');
      setEditingReviewId(null);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review.');
    }
  };

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
            <span className="ml-2 text-gray-600 ">({reviews.length} reviews)</span>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="p-4 border rounded  ">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous'}</span>
                  <div className="flex items-center space-x-4">
                    <StarRating rating={review.rating} />
                    {user && review.user && user._id === review.user._id && (
                      <button
                        onClick={() => handleEditClick(review)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {editingReviewId === review._id ? (
                  <form onSubmit={handleUpdateReview} className="mt-2 space-y-4">
                    <StarRating
                      rating={editData.rating}
                      interactive={true}
                      onRatingChange={(r) => setEditData({ ...editData, rating: r })}
                    />
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editData.comment}
                      onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                      required
                    />
                    <div className="flex space-x-2">
                      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Save</button>
                      <button type="button" onClick={() => setEditingReviewId(null)} className="px-3 py-1 bg-gray-200 rounded text-sm">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-700 ">{review.comment}</p>
                )}
                <p className="text-xs text-gray-500  mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
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
