import React from 'react';
import '../styles/Header.css'; // Import CSS styles if needed
import logoImage from '../images/logo Rp.png'; // Import the actual logo image

const Header = () => {
    return (
        <header className="site-header">
            <div className="header-content">
                <div className="logo">
                    <div className="logo-container">
                        <div className="logo-image">
                            <img src={logoImage} alt="REWS Logo" className="logo-icon-image" />
                        </div>
                        <div className="logo-text">
                            <h1>REWS</h1>
                            <p>Real Estate &amp; Workplace Solutions</p>
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
