import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import "./News.css";

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [fullname, setFullname] = useState("");

    // Lấy userId từ API profile
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Chưa có token!");
            setLoading(false);
            return;
        }

        axios.get("http://localhost:2000/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            if (response.data?.id) {
                setUserId(response.data.id);
                setFullname(response.data.fullname);
            } else {
                console.error("⚠️ Không lấy được thông tin user");
            }
        })
        .catch(error => console.error("❌ Lỗi khi lấy profile:", error))
        .finally(() => setLoading(false));
    }, []);

    // Lấy dữ liệu bài viết + trạng thái like + kiểm tra trạng thái like của user
    useEffect(() => {
        if (!userId) return; // Chờ lấy được userId mới gọi API

        const fetchData = async () => {
            try {
                // Lấy chi tiết bài viết
                const newsResponse = await axios.get(`http://localhost:2000/post/blogs/${id}`);
                setNews(newsResponse.data);
                setLikes(newsResponse.data.likes);

                // Kiểm tra xem user đã like bài viết này chưa
                const likeStatusResponse = await axios.get(`http://localhost:2000/post/blogs/${id}/isLiked?user_id=${userId}`);
                setLiked(likeStatusResponse.data.isLiked);
            } catch (error) {
                console.error("🔥 Lỗi khi lấy chi tiết bài viết hoặc kiểm tra trạng thái like:", error);
            }
        };

        fetchData();
    }, [id, userId]);


    // Hàm định dạng ngày giờ
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    // Xử lý like bài viết
    const handleLike = async () => {
        if (!userId) {
            console.error("⚠️ Không thể like, chưa có userId!");
            return;
        }

        try {
            await axios.post(`http://localhost:2000/post/blogs/${id}/like`, { user_id: userId });
            setLiked(!liked); // Cập nhật trạng thái liked dựa trên phản hồi từ server
            setLikes(liked ? likes - 1 : likes + 1);
        } catch (error) {
            console.error("❌ Lỗi khi like bài viết:", error);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!news) return <h2 className="news-not-found">Không tìm thấy bài viết</h2>;

    return (
        <div className="news-container">
            <h1 className="news-title">{news.title}</h1>
            <div className="news-meta">
                <span className="news-author">📌 {news.author}</span>
                <span className="news-date">📅 {formatDate(news.created_at)}</span>
            </div>
            <img src={news.image} alt={news.title} className="news-image" />
            <p className="news-content">{news.content}</p>

            <div className="news-actions">
                <button className="like-button" onClick={handleLike}>
                    <FaHeart className={`heart-icon ${liked ? "liked" : ""}`} />
                </button>
                <span className="like-count">{likes}</span>
            </div>

            <button className="back-button" onClick={() => navigate(-1)}>← Quay lại</button>
        </div>
    );
};

export default NewsDetail;