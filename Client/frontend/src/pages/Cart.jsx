import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        if (response.data?.id) {
          setUserId(response.data.id);
        } else {
          console.error("Không lấy được userId từ profile");
        }
      })
      .catch((error) => console.error("Lỗi khi lấy profile:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:2000/cart/${userId}`)
      .then((response) => {
        const cartData = response.data.map((item) => ({
          ...item,
          checked: false, // Mặc định chưa chọn
        }));
        setCartItems(cartData || []);
      })
      .catch((error) => console.error("Lỗi khi tải giỏ hàng:", error));
  }, [userId]);

  const toggleCheckbox = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const updateQuantity = (id, delta) => {
    if (!userId) return;
  
    // Cập nhật số lượng trong giỏ hàng trên UI trước khi gửi yêu cầu
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta); // Đảm bảo số lượng không nhỏ hơn 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  
    // Tìm item sau khi đã cập nhật số lượng để log giá trị chính xác
    const updatedItem = cartItems.find((item) => item.id === id);
    console.log("Updating quantity with params:", { userId, cartItemId: id, quantity: updatedItem ? updatedItem.quantity + delta : 0 });
  
    // Gửi yêu cầu PUT để cập nhật số lượng
    axios
      .put("http://localhost:2000/cart/updateQuantity", {
        cartItemId: id, // Sử dụng cartItemId thay vì id
        quantity: Math.max(1, delta), // Cập nhật số lượng, đảm bảo >= 1
      })
      .then(() => {
        toast.success("Cập nhật số lượng thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật số lượng:", error);
        toast.error("Lỗi khi cập nhật số lượng!", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };
  
  const removeItem = (id) => {
    if (!userId) return;

    axios
      .post("http://localhost:2000/cart/removeItem", { cartItemId: id })
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.success("🗑️ Sản phẩm đã được xóa khỏi giỏ hàng!", {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("❌ Lỗi khi xóa sản phẩm!", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.checked);
    if (selectedItems.length === 0) {
      toast.error("❌ Vui lòng chọn ít nhất một sản phẩm để thanh toán!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

    toast.success("✅ Chuyển đến trang thanh toán!", {
      position: "top-right",
      autoClose: 2000,
    });

    navigate("/order");
  };

  const totalPrice = cartItems
    .filter((item) => item.checked)
    .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="shopping-cart">
      <header className="cart-header">
        <h2 className="cart-title">🛒 Giỏ Hàng Của Bạn</h2>
      </header>

      {loading ? (
        <p className="loading-text">Đang tải dữ liệu...</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <input
                    type="checkbox"
                    className="item-checkbox"
                    checked={item.checked || false}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                  <img
                    src={item.image ? `http://localhost:4000/uploads/${item.image}` : "/default-image.jpg"}
                    alt={item.name}
                    className="item-image"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price || 0)}
                    </p>
                  </div>
                  <div className="item-quantity">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>
                      -
                    </button>
                    <input type="number" value={item.quantity || 1} readOnly className="quantity-input" />
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                  <button className="remove-item" onClick={() => removeItem(item.id)}>
                    ✖
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-cart">Giỏ hàng của bạn đang trống! 🛒</p>
            )}
          </div>

          <div className="order-summary">
            <h3 className="cart-title">📋 Tóm Tắt Đơn Hàng</h3>
            <p className="order-total">Tổng: {totalPrice.toLocaleString()} VND</p>
            <div className="order-actions">
              <button className="checkout-btn" disabled={totalPrice === 0} onClick={handleCheckout}>
                Thanh Toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
