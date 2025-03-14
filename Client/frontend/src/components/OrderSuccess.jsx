import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Đơn hàng của bạn đã được đặt thành công!</h2>
      <p>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm giao hàng cho bạn.</p>
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>Quay về trang chủ</Link>
    </div>
  );
};

export default OrderSuccess;
