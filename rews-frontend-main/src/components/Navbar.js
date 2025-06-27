import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css'; // Import CSS styles for Navbar

const Navbar = () => {
    return (
        <nav className="main-nav">
            <ul>
                <li><NavLink to="/Dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/MyTickets">My Tickets</NavLink></li>
                <li><NavLink to="/CreateTicket">Create Ticket</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navbar;
