import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import "./Photobooth.css";

const Photobooth = () => {
  const webcamRef = useRef(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [filter, setFilter] = useState("none");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#ffffff");
  const [dateColor, setDateColor] = useState("#ffffff");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Theo dõi xem quá trình chụp đã được khởi tạo hay chưa

  const availableColors = [
    "#000000",
    "#000080",
    "#FFFFFF",
    "#F0F8FF",
    "#6495ED",
    "#FF69B4",
    "#FFB6C1",
    "#FAFAD2",
    "#87CEFA",
    "#66CDAA",
  ];

  // Hàm lưu trữ ảnh vào Local Storage
  const savePhotosToLocalStorage = (photos) => {
    try {
      localStorage.setItem("photoboothPhotos", JSON.stringify(photos));
    } catch (error) {
      console.error("Lỗi khi lưu ảnh vào localStorage:", error);
    }
  };

  // Hàm lấy ảnh từ Local Storage
  const getPhotosFromLocalStorage = () => {
    try {
      const storedPhotos = localStorage.getItem("photoboothPhotos");
      return storedPhotos ? JSON.parse(storedPhotos) : [];
    } catch (error) {
      console.error("Lỗi khi lấy ảnh từ localStorage:", error);
      return [];
    }
  };

  useEffect(() => {
    // Khi component mount, lấy ảnh từ Local Storage (nếu có)
    const storedPhotos = getPhotosFromLocalStorage();
    if (storedPhotos && storedPhotos.length > 0) {
      setCapturedPhotos(storedPhotos);
      setShowResult(true); // Nếu có ảnh, hiển thị trang kết quả
    }
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    // Lấy ngày tháng hiện tại
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    setDate(`${day}.${month}.${year}`);
  }, []);

  useEffect(() => {
    if (isCapturing && isInitialized) {
      // Thêm điều kiện kiểm tra isInitialized
      let count = 0;
      let intervalId = null; // Lưu trữ ID của interval

      const captureSequence = () => {
        if (count < 4) {
          let currentCountdown = 3;
          setCountdown(currentCountdown);

          intervalId = setInterval(() => {
            currentCountdown--;
            setCountdown(currentCountdown);

            if (currentCountdown <= 0) {
              clearInterval(intervalId); // Dừng interval khi đếm ngược xong
              capturePhoto();
              setIsFlashing(true); // Kích hoạt hiệu ứng chớp sáng
              setTimeout(() => {
                setIsFlashing(false); // Tắt hiệu ứng chớp sáng
                count++;
                setCountdown(null); // Ẩn đếm ngược sau khi chụp

                if (count < 4) {
                  // Tạm dừng 5 giây trước khi chụp ảnh tiếp theo
                  setTimeout(() => {
                    captureSequence();
                  }, 5000);
                } else {
                  // Sau khi chụp đủ 4 ảnh, chuyển sang trang kết quả sau 1 giây
                  setTimeout(() => {
                    savePhotosToLocalStorage(capturedPhotos); // Lưu vào local storage
                    setShowResult(true);
                    setIsCapturing(false); // **QUAN TRỌNG: Dừng quá trình chụp**
                    setIsInitialized(false); // Reset isInitialized sau khi chụp xong
                  }, 1000);
                }
              }, 1000);
            }
          }, 1000);
        } else {
          clearInterval(intervalId);
          setIsCapturing(false); // Đảm bảo dừng nếu có lỗi xảy ra
          setIsInitialized(false); // Reset isInitialized nếu có lỗi
        }
      };
      captureSequence();

      return () => clearInterval(intervalId); // Cleanup function
    }
  }, [isCapturing, isInitialized]);

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // Cắt ảnh
      const croppedImage = await cropImage(imageSrc);
      setCapturedPhotos((prevPhotos) => [...prevPhotos, croppedImage]);
    }
  };

  const cropImage = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const width = 150; // Kích thước chiều rộng mong muốn
        const height = 100; // Kích thước chiều cao mong muốnn

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height, // Nguồn (ảnh gốc)
          0,
          0,
          width,
          height // Đích (canvas)
        );

        resolve(canvas.toDataURL("image/png"));
      };
      img.src = imageSrc;
    });
  };

  const downloadPhotoStrip = async () => {
    const photostrip = document.getElementById("photostrip");
    if (!photostrip) {
      console.error("Không tìm thấy phần tử photostrip!");
      return;
    }
    try {
      const canvas = await html2canvas(photostrip, { scale: 2 }); // Tăng scale để có độ phân giải cao hơn
      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "photostrip.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tạo ảnh:", error);
    }
  };

  const startPhotobooth = () => {
    setCapturedPhotos([]);
    setIsCapturing(true);
    setShowResult(false);
    localStorage.removeItem("photoboothPhotos"); // Xóa ảnh cũ khi chụp lại
    setIsInitialized(true); // Đánh dấu là quá trình chụp đã được khởi tạo
  };

  return (
    <div className="photobooth-container">
      {!showResult ? (
        <div className="camera-section">
          <div className={`webcam-container ${isFlashing ? "webcam-flashing" : ""}`}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              className="webcam"
              style={{ filter: filter }}
              width={700}
              height={432}
            />
            {countdown !== null && <div className="countdown">{countdown}</div>}
          </div>
          <div className="filter-controls">
            <label>Chọn Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="none">Không Filter</option>
              <option value="grayscale(100%)">Đen trắng</option>
              <option value="sepia(100%)">Sepia</option>
            </select>
          </div>
          <button
            className="capture-btn"
            onClick={startPhotobooth}
            disabled={isCapturing}
          >
            Bắt đầu chụp
          </button>
        </div>
      ) : (
        <div className="result-section">
          <div className="photostrip-container">
            <h2>Photostrip</h2>
            <div
              id="photostrip"
              className="photostrip"
              style={{
                backgroundColor: selectedColor,
                width: "160px",
                height: "480px",
              }}
            >
              {capturedPhotos &&
                capturedPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="strip-photo"
                  />
                ))}
              <div
                className="text-overlay"
                style={{
                  top: "93%", // Điều chỉnh vị trí
                  left: "50%", // Căn giữa
                  transform: "translate(-50%, -50%)",
                  fontSize: "0.8em",
                  color: textColor, // Sử dụng textColor
                  textShadow: "1px 1px 2px black",
                  maxWidth: "140px",
                  wordWrap: "break-word",
                  textAlign: "center",
                }}
              >
                {text}
              </div>
              <div
                className="date-overlay"
                style={{
                  bottom: "1%",
                  left: "50%", // Căn giữa
                  transform: "translate(-50%, -50%)",
                  fontSize: "0.7em",
                  color: dateColor, // Sử dụng dateColor
                  textShadow: "1px 1px 2px black",
                }}
              >
                {date}
              </div>
            </div>
          </div>

          <div className="controls-container">
            <div className="color-picker-section">
              <label>Chọn màu nền:</label>
              <div className="color-options">
                {availableColors.map((color) => (
                  <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              <label>Tùy chọn màu nền:</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
            </div>

            <div className="text-section">
              <label>Thêm chữ:</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 16))} // Giới hạn ký tự
                placeholder="Nhập chữ (tối đa 16 ký tự)"
              />
            </div>
            <div className="text-color-section">
              <label>Chọn màu chữ:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
            <div className="date-color-section">
              <label>Chọn màu ngày tháng:</label>
              <input
                type="color"
                value={dateColor}
                onChange={(e) => setDateColor(e.target.value)}
              />
            </div>
            <div className="button-section">
              <button className="save-btn" onClick={downloadPhotoStrip}>
                Lưu ảnh
              </button>
              <button className="retry-btn" onClick={startPhotobooth}>
                Chụp lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photobooth;