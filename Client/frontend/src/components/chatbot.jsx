import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css"; // Import file CSS
import chatbotLogo from "../assets/chatbot.jpg"; // Đường dẫn logo

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Chào bạn! Tôi có thể giúp gì cho bạn?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatbotRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi lại?", sender: "bot" }
      ]);
    }, 1000);
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

  return (
    <div className="chatbot-container">
      {/* Nút mở chatbot */}
      <button className="chatbot-button" onClick={toggleChatbot}>
        <img src={chatbotLogo} alt="Chatbot" className="chatbot-logo" />
      </button>

      {/* Khung chatbot */}
      {isOpen && (
        <div ref={chatbotRef} className="chatbot-box">
          <div className="chatbot-header">
            <h3 className="chatbot-title">LabyBot</h3>
            <button onClick={toggleChatbot} className="chatbot-close">&times;</button>
          </div>

          {/* Nội dung chat */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
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
