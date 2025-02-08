import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./News.css";
import blog from "../assets/blog.png";

// Danh sách tin tức giả định
const newsList = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Bản tin số ${index + 1}`,
  summary: `Tóm tắt nội dung bản tin ${index + 1}`,
  content: `Nội dung đầy đủ của bản tin số ${index + 1}. Đây là đoạn văn bản mô tả chi tiết nội dung của tin tức này.`,
  image: blog
}));

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Tìm tin tức theo ID
  const news = newsList.find((item) => item.id === parseInt(id, 10));

  // Hiển thị nút "Về đầu trang" khi cuộn xuống
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!news) {
    return <h2 className="news-not-found">Không tìm thấy tin tức</h2>;
  }

  return (
    <div className="news-container">
      <h1 className="news-title">{news.title}</h1>
      <img src={news.image} alt={news.title} className="news-image" />
      <p className="news-content">{news.content}</p>

      {/* Nút "Quay lại" ở cuối trang */}
      <button className="back-button" onClick={() => navigate(-1)}>← Quay lại</button>

      {/* Nút "Về đầu trang" */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>▲</button>
      )}
    </div>
  );
};

export default NewsDetail;
