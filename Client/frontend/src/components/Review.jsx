import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Review.css";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  // 📌 Lấy danh sách đánh giá từ API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reviews/${productId}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // 📌 Tính trung bình sao
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // 📌 Thêm đánh giá mới vào API
  const handleAddReview = async () => {
    if (newReview.trim() === "") return;

    const reviewData = {
      user_id: 1, // 🔥 ID user có thể thay bằng session hoặc prop
      product_id: productId,
      rating: newRating,
      comment: newReview,
    };

    try {
      const response = await axios.post("http://localhost:5000/reviews", reviewData);
      setReviews([...reviews, { ...reviewData, username: "Bạn", created_at: new Date() }]);
      setNewReview("");
      setNewRating(5);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };

  return (
    <div className="review-section">
      <h2>Đánh giá sản phẩm</h2>

      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : (
        <>
          {/* Hiển thị số sao trung bình */}
          <p className="average-rating">⭐ Trung bình: {averageRating}/5</p>

          <div className="reviews">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review">
                  <strong>{review.username}</strong>
                  <span>⭐ {review.rating}/5</span>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá nào.</p>
            )}
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
        </>
      )}
    </div>
  );
};

export default ReviewSection;
