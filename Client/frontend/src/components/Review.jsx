import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams để lấy productId từ URL
import "./Review.css";

const ReviewSection = () => {
  const { id: productId } = useParams(); // Lấy productId từ URL
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kiểm tra người dùng đã đăng nhập chưa
  const [user, setUser] = useState(null); // Lưu thông tin người dùng

  // Kiểm tra productId
  useEffect(() => {
    console.log("Product ID từ URL:", productId); // Kiểm tra productId
  }, [productId]);

  // Lấy danh sách đánh giá từ API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/reviews/${productId}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Kiểm tra người dùng đã đăng nhập chưa và lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:2000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setUser(response.data);
        setIsLoggedIn(true);
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setIsLoggedIn(false);
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Tính trung bình sao
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Thêm đánh giá mới
  const handleAddReview = async () => {
    if (newReview.trim() === "") {
      alert("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập trước khi gửi đánh giá.");
      return;
    }

    const reviewData = {
      user_id: user.id, // ID người dùng
      product_id: productId, // Sử dụng productId lấy từ URL
      rating: newRating,
      comment: newReview,
    };

    // Log dữ liệu gửi lên server để kiểm tra
    console.log("Dữ liệu gửi lên backend:", reviewData);

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post("http://localhost:2000/reviews", reviewData);
      
      // Nếu thành công, thêm đánh giá mới vào danh sách
      setReviews([...reviews, { ...reviewData, username: user.username, created_at: new Date() }]);
      setNewReview(""); // Làm mới textarea
      setNewRating(5);  // Đặt lại đánh giá về 5 sao
    } catch (error) {
      // Log lỗi chi tiết
      if (error.response) {
        console.error("Lỗi khi gửi đánh giá:", error.response.data); // In ra lỗi chi tiết từ backend
        alert(error.response.data.error); // Hiển thị thông báo lỗi từ backend
      } else {
        console.error("Lỗi không xác định:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
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
                  {/* Hiển thị tên người dùng */}
                  <strong>{review.username || "Người dùng"}</strong>
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
