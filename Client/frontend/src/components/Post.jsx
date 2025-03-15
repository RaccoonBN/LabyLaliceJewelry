import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDropzone } from "react-dropzone";
import "./Post.css";

const PostModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1, width: 100, height: 100, unit: "%" });
  const imgRef = useRef(null);

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
          setAuthor(response.data.fullname);
        } else {
          console.error("Không lấy được userId hoặc fullname từ profile");
        }
      })
      .catch((error) => console.error("Lỗi khi lấy profile:", error))
      .finally(() => setLoading(false));
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
    },
    noClick: !!imageSrc,
  });

  const handleCropComplete = async () => {
    if (imgRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = Math.min(imgRef.current.naturalWidth, imgRef.current.naturalHeight);
      canvas.width = 1024;
      canvas.height = 1024;

      ctx.drawImage(
        imgRef.current,
        (imgRef.current.naturalWidth - size) / 2,
        (imgRef.current.naturalHeight - size) / 2,
        size,
        size,
        0,
        0,
        1024,
        1024
      );

      canvas.toBlob((blob) => {
        setCroppedImage(URL.createObjectURL(blob));
      }, "image/jpeg");
    }
  };

  const handleClose = () => {
    setTitle("");
    setSummary("");
    setImage(null);
    setImageSrc(null);
    setCroppedImage(null);
    setCrop({ aspect: 1, width: 100, unit: "%" });
    onClose();
  };

  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    if (!title || !summary || !userId) { 
      console.error("Thiếu dữ liệu bài viết!", { title, summary, userId });
      return;
    }
  
    const formData = new FormData();
    formData.append("user_id", userId); 
    formData.append("title", title);
    formData.append("content", summary); // Đảm bảo dùng đúng biến

    if (croppedImage) {
      try {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        formData.append("image", blob, "image.jpg");
      } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error);
        return;
      }
    }
  
    console.log("Dữ liệu gửi API:", [...formData.entries()]); // Debug form data
  
    try {
      const res = await axios.post("http://localhost:2000/post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Bài viết đã được đăng:", res.data);
      onClose();
    } catch (err) {
      console.error("Lỗi khi gửi bài:", err.response ? err.response.data : err.message);
    }
  };
  
  return (
    <div className="post-modal-overlay">
      <div className="post-modal-content">
        <h2>Đăng bài mới</h2>
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
            <p className="post-modal-author">
              <strong>Tác giả:</strong> {loading ? "Đang tải..." : author || "Không xác định"}
            </p>
          </div>

          <div className="post-content-right">
            {!imageSrc && (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Kéo thả ảnh hoặc bấm để tải lên</p>
                <p className="image-requirement">Yêu cầu kích thước tối đa 1024x1024</p>
              </div>
            )}

            {imageSrc && !croppedImage && (
              <>
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
                  <img ref={imgRef} src={imageSrc} alt="Preview" className="preview-img" />
                </ReactCrop>
                <div className="post-modal-buttons">
                  <button className="post-modal-reselect" onClick={() => { setImageSrc(null); setImage(null); }}>Chọn lại</button>
                  <button className="post-modal-confirm" onClick={handleCropComplete}>OK</button>
                </div>
              </>
            )}

            {croppedImage && (
              <>
                <img src={croppedImage} alt="Cropped" className="preview-img" />
                <div className="post-modal-buttons">
                  <button className="post-modal-reselect" onClick={() => { setCroppedImage(null); setImageSrc(null); setImage(null); }}>Chọn lại</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="post-modal-buttons">
          <button className="post-modal-submit" onClick={handleSubmit} disabled={!title || !summary || loading}>
            Đăng bài
          </button>
          <button className="post-modal-close" onClick={handleClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
