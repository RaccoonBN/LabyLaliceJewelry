import React, { useState } from "react";
import "./Review.css";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([
    { user: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm chất lượng!" },
    { user: "Trần Thị B", rating: 4, comment: "Hàng tốt, giá hợp lý." },
  ]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Tính trung bình sao
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleAddReview = () => {
    if (newReview.trim() !== "") {
      setReviews([...reviews, { user: "Bạn", rating: newRating, comment: newReview }]);
      setNewReview("");
      setNewRating(5);
    }
  };

  return (
    <div className="review-section">
      <h2>Đánh giá sản phẩm</h2>

      {/* Hiển thị số sao trung bình */}
      <p className="average-rating">⭐ Trung bình: {averageRating}/5</p>

      <div className="reviews">
        {reviews.map((review, index) => (
          <div key={index} className="review">
            <strong>{review.user}</strong>
            <span>⭐ {review.rating}/5</span>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Thêm đánh giá */}
      <div className="add-review">
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Nhập đánh giá của bạn..."
        ></textarea>

        {/* Chọn số sao bằng ngôi sao */}
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= newRating ? "star filled" : "star"}
              onClick={() => setNewRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <button onClick={handleAddReview}>Gửi đánh giá</button>
      </div>
    </div>
  );
};

export default ReviewSection;
