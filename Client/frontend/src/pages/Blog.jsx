import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Blog.css";
import blog from "../assets/blog.png";

const newsList = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Bản tin số ${index + 1}`,
  summary: `Tóm tắt nội dung bản tin ${index + 1}`,
  image: blog
}));

const ITEMS_PER_PAGE = 20; // 5 dòng x 5 tin mỗi dòng
const ITEMS_PER_ROW = 4;

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = newsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="blog-container">
      {Array.from({ length: Math.ceil(paginatedNews.length / ITEMS_PER_ROW) }).map((_, rowIndex) => (
        <div key={rowIndex} className="blog-row">
          {paginatedNews.slice(rowIndex * ITEMS_PER_ROW, (rowIndex + 1) * ITEMS_PER_ROW).map((news) => (
            <div key={news.id} className="blog-card" onClick={() => navigate(`/news/${news.id}`)}>
              <img src={news.image} alt={news.title} className="blog-image" />
              <div className="blog-content">
                <h2 className="blog-title">{news.title}</h2>
                <p className="blog-summary">{news.summary}</p>
                <Link to={`/news/${news.id}`} className="blog-read-more" onClick={(e) => e.stopPropagation()}>
                  Đọc tiếp
                </Link>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Phân trang dạng số */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <button
            key={pageIndex + 1}
            className={currentPage === pageIndex + 1 ? "active" : ""}
            onClick={() => setCurrentPage(pageIndex + 1)}
          >
            {pageIndex + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


export default BlogPage;
