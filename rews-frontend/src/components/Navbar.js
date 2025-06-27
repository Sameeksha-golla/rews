import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css'; // Import CSS styles for Navbar
import { FaTicketAlt, FaPlus, FaTachometerAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ isAdmin = false }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };
    return (
        <nav className="main-nav horizontal">
            <div className="nav-container">
                {isAdmin ? (
                    // Admin Navigation
                    <ul className="nav-tabs">
                        <li>
                            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaTachometerAlt className="nav-icon" /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/tickets" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaTicketAlt className="nav-icon" /> All Tickets
                            </NavLink>
                        </li>
                        <li>
                            <button className="logout-button" onClick={handleLogout}>
                                <FaSignOutAlt className="nav-icon" /> Logout
                            </button>
                        </li>
                    </ul>
                ) : (
                    // User Navigation
                    <ul className="nav-tabs">
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaTachometerAlt className="nav-icon" /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/my-tickets" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaTicketAlt className="nav-icon" /> My Tickets
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/create-ticket" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaPlus className="nav-icon" /> Create Ticket
                            </NavLink>
                        </li>
                        <li>
                            <button className="logout-button" onClick={handleLogout}>
                                <FaSignOutAlt className="nav-icon" /> Logout
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
