import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./Blog.css";
import blogImage from "../assets/blog.png";
import PostModal from "../components/Post"; // Import đúng tên component

const ITEMS_PER_PAGE = 5;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy userId và fullname từ API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Chưa có token!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:2000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data?.id && response.data?.fullname) {
          setUserId(response.data.id);
          setFullname(response.data.fullname);
        } else {
          console.error("Không lấy được thông tin user");
        }
      })
      .catch((error) => console.error("Lỗi khi lấy profile:", error))
      .finally(() => setLoading(false));
  }, []);

  // Lấy danh sách bài viết từ API (hoặc dữ liệu mẫu)
  useEffect(() => {
    axios.get("http://localhost:2000/post/blogs")
        .then((response) => {
            console.log("Dữ liệu API trả về:", response.data);
            if (!Array.isArray(response.data) || response.data.length === 0) {
                console.error("LỖI: API không trả về danh sách bài viết hợp lệ!");
                return;
            }
            setPosts(response.data);
        })
        .catch((error) => console.error("Lỗi khi tải bài viết:", error));
}, []);



  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Xử lý like bài viết
 // Xử lý like bài viết
const handleLike = async (blogId) => {
  console.log("👤 userId:", userId);
  console.log("📝 blogId:", blogId);

  if (!userId) {
      console.error("Người dùng chưa đăng nhập!");
      return;
  }

  if (!blogId) {
      console.error("Lỗi: blogId không hợp lệ!");
      return;
  }

  try {
      console.log("🔍 Gửi yêu cầu like/unlike với blog_id:", blogId);

      const response = await axios.post(
          `http://localhost:2000/post/blogs/${blogId}/like`,
          { user_id: userId }
      );

      console.log("📩 Phản hồi từ server:", response.data.message);

      setPosts((prevPosts) => {
          console.log("🔄 Cập nhật like:", prevPosts);
          return prevPosts.map((post) =>
              post.id === blogId
                  ? {
                      ...post,
                      isLiked: !post.isLiked,
                      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                  }
                  : post
          );
      });
  } catch (error) {
      console.error("❌ Lỗi khi like/unlike bài viết:", error);
      console.log("📢 Chi tiết lỗi:", error.response);
  }
};

  
  

  // Thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Xử lý đăng bài mới
  const handleNewPost = (newPost) => {
    if (!userId) {
      console.error("Không có userId, không thể đăng bài!");
      return;
    }

    const postToAdd = {
      id: posts.length + 1,
      title: newPost.title.substring(0, 20), // Giới hạn tiêu đề 20 ký tự
      summary: newPost.summary.substring(0, 500), // Giới hạn nội dung 500 ký tự
      image: newPost.image || blogImage, // Dùng ảnh mặc định nếu không có ảnh
      author: fullname, // Lấy tên từ userId
      likes: 0,
      isLiked: false,
    };

    setPosts([postToAdd, ...posts]); // Thêm bài mới vào danh sách
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title-page">Blog Trang Sức</h1>

      {paginatedPosts.map((post) => (
        <div key={post.id} className="blog-card">
          <div className="blog-header">
            <h2 className="blog-title">{post.title}</h2>
            <p className="blog-author">Đăng bởi: {post.author}</p>
          </div>
          <img
            src={post.image}
            alt={post.title}
            className="blog-image"
            onClick={() => navigate(`/news/${post.id}`)}
          />
          <div className="blog-actions">
            <button className="like-button" onClick={() => handleLike(post.id)}>
              <FaHeart className={`heart-icon ${post.isLiked ? "liked" : ""}`} />
            </button>
            <span className="like-count">{post.likes} lượt thích</span>
          </div>
          <div className="blog-content">
            <p className="blog-summary">
              {post.content.split(" ").slice(0, 30).join(" ")}...
            </p>
            <Link to={`/news/${post.id}`} className="read-more">
              Đọc tiếp
            </Link>
          </div>
        </div>
      ))}

      {/* Phân trang */}
      <div className="pagination">
        <button className="page-button" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          ← Trước
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`page-button ${currentPage === i + 1 ? "active" : ""}`} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button className="page-button" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          Sau →
        </button>
      </div>

      {/* Nút nổi đăng bài */}
      <button className="floating-button" onClick={() => setIsModalOpen(true)}>
        <FaPlus className="plus-icon" />
      </button>

      <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleNewPost} />
    </div>
  );
};

export default BlogPage;
