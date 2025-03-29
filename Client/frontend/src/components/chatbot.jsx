import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import axios
import "./chatbot.css";
import chatbotLogo from "../assets/chatbot.jpg";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Chào bạn! Tôi có thể giúp gì cho bạn?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]); // State để lưu trữ sản phẩm gợi ý
  const chatbotRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = async () => { // Thêm async
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      // Gọi API Rasa
      const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", { // Thay đổi URL nếu cần
        message: input,
        sender: "user" // Thêm sender
      });

      // Xử lý phản hồi từ Rasa
      response.data.forEach((message) => {
        if (message.text) {
          setMessages((prev) => [...prev, { text: message.text, sender: "bot" }]);
        }
        // Xử lý các loại phản hồi khác (ví dụ: hình ảnh, nút bấm) nếu cần
        if (message.image) {
          setMessages((prev) => [...prev, { type: 'image', image: message.image, sender: 'bot' }]);
        }

        if (message.custom && message.custom.products) { // Kiểm tra và lưu trữ sản phẩm gợi ý
          setSuggestedProducts(message.custom.products);
        } else {
          setSuggestedProducts([]); // Xóa sản phẩm cũ nếu không có sản phẩm mới
        }
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn đến Rasa:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Xin lỗi, có lỗi xảy ra khi kết nối đến chatbot.", sender: "bot" }
      ]);
    }
  };

  const handleProductClick = (productId) => { // Hàm xử lý click vào sản phẩm
    // Chuyển hướng đến trang chi tiết sản phẩm
    window.location.href = `/product/${productId}`; // Thay đổi URL nếu cần
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    //Scroll to bottom when messages change
    const messageContainer = document.querySelector(".chatbot-messages");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // Định dạng giá tiền thành VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={toggleChatbot}>
        <img src={chatbotLogo} alt="Chatbot" className="chatbot-logo" />
      </button>

      {isOpen && (
        <div ref={chatbotRef} className="chatbot-box">
          <div className="chatbot-header">
            <h3 className="chatbot-title">LabyBot</h3>
            <button onClick={toggleChatbot} className="chatbot-close">×</button>
          </div>

          {/* Nội dung chat */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              msg.type === 'image' ? (
                <div key={index} className={`chatbot-message ${msg.sender}`}>
                  <img src={msg.image} alt="Chatbot" />
                </div>
              ) : (
                <div key={index} className={`chatbot-message ${msg.sender}`}>
                  {msg.text}
                </div>
              )
            ))}
          {/* Hiển thị danh sách sản phẩm */}
          {suggestedProducts.length > 0 && (
            <div className="product-list-container">
              {suggestedProducts.map((product) => {
                // Xử lý lỗi đường dẫn bị lặp
                let imageUrl = product.image;
                if (imageUrl.startsWith("http://localhost:4000/uploads/http://localhost:4000/uploads/")) {
                  imageUrl = imageUrl.replace("http://localhost:4000/uploads/http://localhost:4000/uploads/", "http://localhost:4000/uploads/");
                } else if (!imageUrl.startsWith("http")) {
                  imageUrl = `http://localhost:4000/uploads/${imageUrl}`;
                }

                return (
                  <div key={product.id} className="product-item-card">
                    <img src={imageUrl} alt={product.name} className="product-item-image" />
                    <h4 className="product-item-title">{product.name}</h4>
                    <p className="product-item-price">
                      Giá: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                    </p>
                    <button className="product-item-button" onClick={() => handleProductClick(product.id)}>Xem chi tiết</button>
                  </div>
                );
              })}
            </div>


            )}
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="chatbot-input">
            <input
              type="text"
              className="chatbot-textbox"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="chatbot-send" onClick={handleSendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;