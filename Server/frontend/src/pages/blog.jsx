import React, { useState } from "react";
import "./blog.css";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import blog from "../assets/blog.png";

const BlogManagement = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Bài viết 1",
      content: "Nội dung bài viết 1...",
      image: blog
    },
    {
      id: 2,
      title: "Bài viết 2",
      content: "Nội dung bài viết 2...",
      image: blog
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const openModal = (post = null) => {
    setEditingPost(post);
    setTitle(post ? post.title : "");
    setContent(post ? post.content : "");
    setImage(post ? post.image : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const savePost = () => {
    if (editingPost) {
      setPosts(
        posts.map((post) =>
          post.id === editingPost.id ? { ...post, title, content, image } : post
        )
      );
    } else {
      setPosts([...posts, { id: Date.now(), title, content, image }]);
    }
    closeModal();
  };

  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="blog-management">
      <h2>Quản lý Blog</h2>
      <button className="add-btn" onClick={() => openModal()}>+ Thêm bài viết</button>
      
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt="Post" />
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => openModal(post)}>
                <FaEdit />
              </button>
              <button className="delete-btn" onClick={() => deletePost(post.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết"}</h3>
            <label>Tiêu đề:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Nội dung:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />

            <label>Hình ảnh:</label>
            <div className="upload-container">
              <input type="file" id="fileInput" onChange={handleFileUpload} hidden />
              <button className="upload-btn" onClick={() => document.getElementById("fileInput").click()}>
                <FaUpload /> Chọn ảnh
              </button>
              {image && <img src={image} alt="Preview" className="image-preview" />}
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={savePost}>Lưu</button>
              <button className="cancel-btn" onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
