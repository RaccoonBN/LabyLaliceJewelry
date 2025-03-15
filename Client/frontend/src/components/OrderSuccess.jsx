import { Link } from "react-router-dom";
import './OrderSuccess.css';
import truckGif from '../assets/order_success.gif';  // Đường dẫn đến GIF

const OrderSuccess = () => {
  return (
    <div className="order-success">
      <div className="order-success__content">
        {/* Icon xe giao hàng dưới dạng GIF với hiệu ứng di chuyển */}
        <div className="order-success__icon">
          <img 
            src={truckGif} 
            alt="Giao hàng thành công" 
            className="order-success__truck-gif" 
          />
        </div>

        <h2 className="order-success__title">✅ Đơn hàng của bạn đã được đặt thành công!</h2>
        <p className="order-success__message">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm giao hàng cho bạn.</p>
        
        {/* Link quay về trang chủ */}
        <Link to="/" className="order-success__link">Quay về trang chủ</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
