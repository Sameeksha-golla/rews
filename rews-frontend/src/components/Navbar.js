import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css'; // Import CSS styles for Navbar

const Navbar = () => {
    return (
        <nav className="main-nav">
            <div className="nav-container">
                <ul className="nav-tabs">
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
                    <li><NavLink to="/my-tickets" className={({ isActive }) => isActive ? 'active' : ''}>My Tickets</NavLink></li>
                    <li><NavLink to="/create-ticket" className={({ isActive }) => isActive ? 'active' : ''}>Create Ticket</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
