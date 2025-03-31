import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/header";
import Footer from "./components/footer";
import OrderHistory from "./pages/OrderHistory";
import EditAccount from "./pages/EditAccount";
import AboutUs from "./pages/AboutUs"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Chatbot from "./components/chatbot";
import BlogPage from "./pages/Blog";
import NewsDetail from "./pages/News";
import AllProduct from "./pages/AllProduct";
import ProductPage from "./pages/Product";
import OrderDetail from "./pages/orderDetail";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import NotificationModal from "./components/NotificationModal";
import OrderSuccess from "./components/OrderSuccess";
import PhotoBooth from "./pages/Photobooth";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* Các route cho ứng dụng */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order-history" element={<OrderHistory />} /> {/* Route cho Order History */}
          <Route path="/edit-account" element={<EditAccount />} /> {/* Route cho Edit Account */}
          <Route path="/AboutUs" element={<AboutUs />} /> {/* Route cho AboutUs */}
          <Route path="/Login" element={<Login />} /> {/* Route cho Login */}
          <Route path="/Register" element={<Register />} /> {/* Route cho Register */}
          <Route path="/BlogPage" element={<BlogPage />} /> {/* Route cho Blog */}
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/all-products" element={<AllProduct />} />
          <Route path="/product/:id" element={<ProductPage />} />{/* Route chi tiết sản phẩm */}
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/noti" element={<NotificationModal />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/photobooth" element={<PhotoBooth />} />
        </Routes>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;