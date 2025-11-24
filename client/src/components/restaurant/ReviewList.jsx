import { useNavigate } from "react-router-dom";
import "../../styles/ReviewList.css";

export default function ReviewList({ reviews }) {
  const navigate = useNavigate();

  if (!reviews || reviews.length === 0) return <p>No reviews yet</p>;

  // Show only top 3 highlighted reviews
  const highlightedReviews = reviews.slice(0, 3);

  const goToFullReview = (reviewId) => {
    navigate(`/reviews/${reviewId}`, { state: { reviews } });
  };

  return (
    <div className="highlighted-comments-container">
      {highlightedReviews.map((review) => (
        <div
          key={review.id}
          className="review-card"
          onClick={() => goToFullReview(review.id)}
        >
          <div className="review-card-left">
            <div className="review-avatar">
              {review.avatar ? (
                <img src={review.avatar} alt={review.user} />
              ) : (
                <span>{review.user[0].toUpperCase()}</span>
              )}
            </div>
          </div>

          <div className="review-card-right">
            <div className="review-header">
              <span className="review-user">{review.user}</span>
              <span className="review-rating">⭐ {review.rating}</span>
            </div>

            <p className="review-text">{review.comment}</p>

            <p className="review-date">{review.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
