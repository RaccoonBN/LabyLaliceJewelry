import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import momoLogo from "../assets/momo.png";
import vnpayLogo from "../assets/vnpay.png";
import axios from "axios";
import "./Order.css";
import { useLocation } from 'react-router-dom';

const Order = () => {
    const [orderDetails, setOrderDetails] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        paymentMethod: "cod",
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

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
        const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
        console.log("Danh sách mặt hàng trong giỏ hàng:", checkoutItems);
        const validCheckoutItems = checkoutItems.filter(item => item.checked && item.product_id);
        setSelectedItems(validCheckoutItems);
    }, []);

    useEffect(() => {
        // Check for payment status after returning from VNPay
        const searchParams = new URLSearchParams(location.search);
        const paymentStatus = searchParams.get('paymentStatus');
        const errorCode = searchParams.get('errorCode');

        if (paymentStatus === 'success') {
            alert('Thanh toán thành công!');
            clearCartAndNavigate();
        } else if (paymentStatus === 'failed') {
            alert(`Thanh toán thất bại. Mã lỗi: ${errorCode}`);
        }
    }, [location]);

    const handleChange = (e) => {
        setOrderDetails({
            ...orderDetails,
            [e.target.name]: e.target.value,
        });
    };

    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            console.error("Không có userId, không thể tạo đơn hàng");
            alert("Vui lòng đăng nhập để tiếp tục!");
            return;
        }

        if (!orderDetails.name || !orderDetails.address || !orderDetails.phone || !orderDetails.email) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
            return;
        }

        for (const item of selectedItems) {
            if (!item.product_id || typeof item.product_id !== 'number') {
                console.error("Sản phẩm không có product_id:", item);
                alert("Có lỗi xảy ra. Vui lòng kiểm tra lại giỏ hàng!");
                return;
            }
        }

        const orderData = {
            userId,
            items: selectedItems.map(({ product_id, name, quantity, price }) => ({ id: parseInt(product_id, 10), name, quantity, price })),
            totalAmount,
            ...orderDetails,
        };
        console.log("Dữ liệu gửi lên API:", orderData);

        if (orderDetails.paymentMethod === 'cod') {
            // Xử lý thanh toán COD
            try {
                const response = await axios.post("http://localhost:2000/orders", orderData);
                console.log("Đơn hàng được tạo thành công:", response.data);
                clearCartAndNavigate();
            } catch (error) {
                handleOrderError(error);
            }
        } else if (orderDetails.paymentMethod === 'momo') {
            // Xử lý thanh toán MoMo (tương lai)
            alert('Chức năng thanh toán MoMo chưa được hỗ trợ!');
        }
        else if (orderDetails.paymentMethod === 'vnpay') {
            // Xử lý thanh toán VNPay
            try {
                const paymentResponse = await axios.post(
                    "http://localhost:2000/vnpay/create_payment_url",  // API tạo URL thanh toán VNPay
                    {
                        amount: totalAmount,
                        bankCode: '', 
                        language: 'vn' 
                    }
                );

                if (paymentResponse.data && paymentResponse.data.paymentUrl) {
                    window.location.href = paymentResponse.data.paymentUrl;
                } else {
                    throw new Error("Không nhận được paymentUrl từ backend");
                }
            } catch (error) {
                handleOrderError(error);
            }
        }
    };

    const clearCartAndNavigate = () => {
        // Xóa các sản phẩm đã thanh toán từ localStorage
        const updatedCheckoutItems = JSON.parse(localStorage.getItem("checkoutItems") || "[]").filter(item => !item.checked);
        localStorage.setItem("checkoutItems", JSON.stringify(updatedCheckoutItems));
        setSelectedItems([]);
        navigate("/order-success");
    };

    const handleOrderError = (error) => {
        console.error("Lỗi khi tạo đơn hàng:", error.response ? error.response.data : error.message);
        alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-page">
            <h2 className="order-page__title">Xác Nhận Đơn Hàng</h2>
            <form onSubmit={handleOrderSubmit} className="order-page__form">
                <input
                    type="text"
                    name="name"
                    placeholder="Họ và Tên"
                    value={orderDetails.name}
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ nhận hàng"
                    value={orderDetails.address}
                    required
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={orderDetails.phone}
                    required
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Địa chỉ Email"
                    value={orderDetails.email}
                    required
                    onChange={handleChange}
                />

                <h3>Phương Thức Thanh Toán</h3>
                <div className="order-page__payment-options">
                    <label className="order-page__payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={orderDetails.paymentMethod === "cod"}
                            onChange={handleChange}
                        />
                        <span>Thanh toán khi nhận hàng</span>
                    </label>

                    <label className="order-page__payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="momo"
                            checked={orderDetails.paymentMethod === "momo"}
                            onChange={handleChange}
                        />
                        <img
                            src={momoLogo}
                            alt="MoMo"
                            className="order-page__payment-logo"
                        />
                        <span>MoMo</span>
                    </label>

                    <label className="order-page__payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="vnpay"
                            checked={orderDetails.paymentMethod === "vnpay"}
                            onChange={handleChange}
                        />
                        <img
                            src={vnpayLogo}
                            alt="VNPay"
                            className="order-page__payment-logo"
                        />
                        <span>VNPay</span>
                    </label>
                </div>

                <div className="order-page__summary">
                    <h3>Chi Tiết Đơn Hàng</h3>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item) => (
                                <tr key={item.product_id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p><strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VND</p>
                </div>

                <button type="submit" className="order-page__button">Đặt Hàng</button>
            </form>
        </div>
    );
};

export default Order;