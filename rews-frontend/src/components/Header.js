import React from 'react';
import '../styles/Header.css';
import logo from '../images/logo.png';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-container">
            <div className="logo-image">
              <img src={logo} alt="REWS Logo" className="logo-img" />
            </div>
            <div className="logo-text">
              <h1>REWS</h1>
              <p>REAL ESTATE & WORKPLACE SOLUTIONS</p>
            </div>
          </div>
        </div>
        <div className="contact-info">
          <p>CONTACT US</p>
          <p>+91-80-4567-8900</p>
          <p>SUPPORT@REWS.COM</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
