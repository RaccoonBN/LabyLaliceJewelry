import React from "react";
import "./footer.css";
import { FaFacebookF, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Import các icon từ react-icons
import logo from '../assets/logo.png';
import store from '../assets/store.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        {/* Phía bên trái */}
        <div className="footer__left">
          <div className="footer__logo-slogan">
            <img src={logo} alt="Logo" />
            <p className="footer__slogan">Phong Cách - Sang Trọng - Quý Phái</p>
          </div>
          <div className="footer__contact-info">
            <p><FaPhoneAlt /> (123) 456-7890</p>
            <p><FaEnvelope /> info@labylalice.com</p>
          </div>
        </div>

        {/* Trung tâm */}
        <div className="footer__center">
          <div className="footer__social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Phía bên phải */}
        <div className="footer__right">
          <h3>CỬA HÀNG CỦA CHÚNG TÔI</h3>
          <div className="footer__store-info">
            <img src={store} alt="Store" className="footer__store-image" />
            <p className="footer__store-address">18A/1 Cộng Hòa, Phường 15, Quận Tân Bình, TP.HCM</p>
            <div className="footer__google-map">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1473936145953!2d106.65184127462753!3d10.800021089350237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292976c117ad%3A0x5b3f38b21051f84!2zSOG7jWMgVmnhu4duIEjDoG5nIEtow7RuZyBWaeG7h3QgTmFtIENTMg!5e0!3m2!1svi!2s!4v1736448967533!5m2!1svi!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
