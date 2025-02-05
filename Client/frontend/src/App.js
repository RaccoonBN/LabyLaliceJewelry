import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Home from "./pages/Home"; 
import Header from "./components/header"; 
import Footer from "./components/footer"; 
import OrderHistory from "./pages/OrderHistory"; 
import EditAccount from "./pages/EditAccount"; 

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
          <Route path="/Cart" element={<Cart />} /> {/* Route cho Cart */}

        </Routes>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
