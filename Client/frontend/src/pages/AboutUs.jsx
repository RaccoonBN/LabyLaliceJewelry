
import React from "react";
import "./AboutUs.css";
import us1 from "../assets/us1.png";
import us2 from "../assets/us2.png";

// Main Component
const MainContent = () => {
  return (
    <div className="app-container">
      <div className="main-container">
        <div className="section">
          <div className="section-image">
              <img src={us1} alt="Ảnh 1" />
          </div>
          <div className="section-text">
            <h2 classname="text_titletitle">THIẾT KẾ ĐỘC QUYỀN TỪ HÀN QUỐC</h2>
            <p classnameclassname="text_descrip">
              Lấy tầm nhìn trở thành "Nhà bán lẻ trang sức dẫn đầu xu hướng",
              trang sức LabyLalice mang phong cách trẻ trung, hiện đại, liên tục
              cập nhật những xu hướng mới từ Hàn Quốc. Bộ sưu tập sản phẩm chủ lực
              của LabyLalice Jewelry gồm có: Nhẫn cưới, Trang sức cưới và Trang sức
              hiện đại cho nữ giới. Khách hàng sở hữu trang sức vàng từ LabyLalice
              Jewelry đồng thời sở hữu xu hướng mới nhất đến từ thế giới, được thể
              hiện bằng sản phẩm mang tính sáng tạo, đột phá trong thiết kế và công
              nghệ chế tác.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="section-text">
            <h2 classname="text_titletitle">NHỮNG CÂU CHUYỆN HẠNH PHÚC</h2>
            <p classnameclassname="text_descrip">
              Mang trong mình sứ mệnh sẽ trở thành bạn đồng hành luôn thấu hiểu và
              trân trọng từng khoảnh khắc trong cuộc sống của khách hàng, slogan
              của LabyLalice Jewelry là "Tales of Happiness" (Câu chuyện của hạnh
              phúc). Hạnh phúc, tình yêu, kỉ niệm... được hình thành trong sự gắng
              vàng - nguyên liệu quý có giá trị không bao giờ mai một để trang sức
              không chỉ bền đẹp, mà luôn gợi nhớ mỗi người từng dấu mốc đáng nhớ đã
              trải qua.
            </p>
            <p>
              Chiếc lắc tay có giá trị thương cho mình nhân dịp thăng chức sau thời
              gian nỗ lực trong công việc. Sợi dây chuyền bạn trai đích thân chọn
              mua tặng người yêu nhân kỉ niệm của hai người.
            </p>
            <p>
              Đôi bông tai con gái nhân tháng lương đầu tiên liên mua tặng mẹ. Cặp
              nhẫn cưới hai người yêu nhau cùng chọn cho một chương mới gắn kết với
              chồng. Chiếc nhẫn lưu trữ bao kỉ niệm từ được chuyển tiếp cho con,
              cho cháu; để câu chuyện hạnh phúc được lưu giữ mãi với thời gian.
            </p>
          </div>
          <div className="section-image">
          <img src={us2} alt="Ảnh 1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
