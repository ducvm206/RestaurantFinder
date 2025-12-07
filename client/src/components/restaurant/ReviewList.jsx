import { useNavigate } from "react-router-dom";
import "../../styles/ReviewList.css";

export default function ReviewList({ reviews }) {
  const navigate = useNavigate();

  if (!reviews || reviews.length === 0) return <p>No reviews yet</p>;

  const highlightedReviews = reviews.slice(0, 3);

  const goToFullReview = (reviewId) => {
    navigate(`/reviews/${reviewId}`, { state: { reviews } });
  };

  return (
    <div className="highlighted-comments-container">
      {highlightedReviews.map((review) => (
        <div
          key={review.review_id}
          className="review-card"
          onClick={() => goToFullReview(review.review_id)}
        >
          <div className="review-card-left">
            <div className="review-avatar">
              {review.user.avatar ? (
                <img
                  src={`http://localhost:5000${review.user.avatar}`}
                  alt={review.user.fullName}
                />
              ) : (
                <span>{review.user.fullName[0].toUpperCase()}</span>
              )}
            </div>
          </div>

          <div className="review-card-right">
            <div className="review-header">
              <span className="review-user">{review.user.fullName}</span>
              <span className="review-rating">⭐ {review.rating}</span>
            </div>

            <p className="review-text">{review.comment}</p>
            <p className="review-date">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
