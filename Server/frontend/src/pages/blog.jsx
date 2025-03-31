import React, { useState, useEffect, useRef } from "react";
import "./blog.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "http://localhost:4000/blogs"; // Giữ nguyên /blogs

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]); // Đã sửa tên thành blogs
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null); //Sửa  editingPost thành editingBlog
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // React Crop states
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ aspect: 1 });
    const [croppedImage, setCroppedImage] = useState(null);
    const imgRef = useRef(null);

    useEffect(() => {
        fetchBlogs(); // Sửa fetchPost thành fetchBlogs
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            setBlogs(response.data.blogs); // Giữ nguyên response.data.blogs
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bài viết:", error);
            setError("Lỗi khi lấy danh sách bài viết. Vui lòng thử lại sau.");
            toast.error("Lỗi khi lấy danh sách bài viết.", { position: "top-right" });
        }
    };

   // Inside openModal function:
    const openModal = (blog = null) => {
        setEditingBlog(blog);
        setTitle(blog ? blog.title : "");
        setSummary(blog ? blog.content : "");
        setImage(null); // reset image
        setCroppedImage(null); // reset cropped image
        setError(null);

        // Initialize imageSrc with existing image URL if editing
        setImageSrc(blog ? blog.image : null);

        setModalOpen(true);
    };


    const closeModal = () => {
        setModalOpen(false);
        setEditingBlog(null); //Sửa  editingPost thành editingBlog
        setTitle("");
        setSummary("");
        setImage(null);
        setImageSrc(null);
        setCroppedImage(null);
        setError(null);
    };

    // React Dropzone functions
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImageSrc(reader.result);
            reader.readAsDataURL(file);
        }
    });

    const handleCropComplete = () => {
        if (!imgRef.current || !crop.width || !crop.height) {
            return;
        }

        const canvas = document.createElement('canvas');
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        setCroppedImage(base64Image);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
    
        const formData = new FormData();
        formData.append('title', title || ''); // Use empty string as default
        formData.append('content', summary || ''); // Use empty string as default
        if (image) {
            formData.append('image', image);
        }
    
        try {
            let response;
            if (editingBlog) {
                response = await axios.put(`${API_BASE_URL}/${editingBlog.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success("Cập nhật bài viết thành công!", { position: "top-right" });
            } else {
                response = await axios.post(`${API_BASE_URL}/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success("Thêm bài viết thành công!", { position: "top-right" });
            }
    
            console.log("API response:", response.data);
            fetchBlogs();
            closeModal();
        } catch (error) {
            console.error("Lỗi khi đăng/chỉnh sửa bài viết:", error);
            setError("Lỗi khi đăng/chỉnh sửa bài viết. Vui lòng thử lại.");
            toast.error("Lỗi khi đăng/chỉnh sửa bài viết.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const deleteBlog = async (id) => {  //Sửa  deletePost thành deleteBlog
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            fetchBlogs(); // Sửa fetchPost thành fetchBlogs
            toast.success("Xóa bài viết thành công!", { position: "top-right" });
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error);
            setError("Lỗi khi xóa bài viết. Vui lòng thử lại.");
            toast.error("Lỗi khi xóa bài viết.", { position: "top-right" });
        }
    };

    const resetImage = () => {
        setImageSrc(null);
        setImage(null);
        setCroppedImage(null);
    };

    return (
        <div className="blog-management">
            <h2>Quản lý Blog</h2>
            <button className="add-btn" onClick={() => openModal()}>+ Thêm bài viết</button>

            {error && <div className="error-message">{error}</div>}

            <div className="post-list">
                {blogs.map((blog) => ( //Sửa  posts thành blogs
                    <div key={blog.id} className="post-card">
                        <img src={blog.image || "/default-blog.jpg"} alt="Blog" />
                        <h3>{blog.title}</h3>
                        <p>{blog.content}</p>
                        {/* Thêm tên tác giả */}
                        <p className="author">Tác giả: {blog.author}</p>
                        <div className="action-buttons">
                            <button className="edit-btn" onClick={() => openModal(blog)}>
                                <FaEdit />
                            </button>
                            <button className="delete-btn" onClick={() => deleteBlog(blog.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="post-modal-overlay">
                    <div className="post-modal-content">
                        <div className="h2-modal">{editingBlog ? "Chỉnh sửa bài viết" : "Đăng bài mới"}
                        </div>
                        <div className="post-modal-body">
                            <div className="post-content-left">
                                <input
                                    type="text"
                                    className="post-modal-input"
                                    placeholder="Tiêu đề (tối đa 20 ký tự)"
                                    value={title}
                                    onChange={(e) => e.target.value.length <= 20 && setTitle(e.target.value)}
                                />
                                <textarea
                                    className="post-modal-textarea"
                                    placeholder="Tóm tắt nội dung (tối đa 500 ký tự)"
                                    value={summary}
                                    onChange={(e) => e.target.value.length <= 500 && setSummary(e.target.value)}
                                />
                            </div>

                            <div className="post-content-right">
                                { !imageSrc && (
                                    <div {...getRootProps()} className="dropzone">
                                        <input {...getInputProps()} />
                                        <p>Kéo thả ảnh hoặc bấm để tải lên</p>
                                        <p className="image-requirement">Yêu cầu kích thước tối đa 1024x1024</p>
                                    </div>
                                )}

                                {imageSrc && !croppedImage && (
                                    <>
                                        <img ref={imgRef} src={imageSrc} alt="Preview" className="preview-img" />
                                        <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
                                            <img ref={imgRef} src={imageSrc} alt="Preview" className="preview-img" />
                                        </ReactCrop>
                                        <div className="post-modal-buttons">
                                            <button className="post-modal-reselect" onClick={resetImage}>Chọn lại</button>
                                            <button className="post-modal-confirm" onClick={handleCropComplete}>OK</button>
                                        </div>
                                    </>
                                )}

                                {croppedImage && (
                                    <>
                                        <img src={croppedImage} alt="Cropped" className="preview-img" />
                                        <div className="post-modal-buttons">
                                            <button className="post-modal-reselect" onClick={resetImage}>Chọn lại</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="post-modal-buttons">
                            <button className="post-modal-submit" onClick={handleSubmit} disabled={!title || !summary || loading}>
                                {loading ? "Đang xử lý..." : "Đăng bài"}
                            </button>
                            <button className="post-modal-close" onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default BlogManagement;