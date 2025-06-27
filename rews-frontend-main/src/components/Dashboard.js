import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import '../styles/Dashboard.css'; // Import your CSS for styling

const Dashboard = () => {
  // You might want to replace these with actual data or state
  const openTickets = 0;
  const inProgressTickets = 0;
  const closedTickets = 0;

  // Our Services data with icons
  const servicesData = {
    "Badge & Security": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 16L12 12L17 16" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    "Operations": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    "Event Support": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    "Travel & Accommodation": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="7.5,12 12,15.5 16.5,12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    "Concierge Services": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    "Lost & Found": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          <path d="M11 8a3 3 0 1 1 0 6" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    "Stationery & Business Cards": {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  };

  return (
    <div>
      <div className="header-section">
        <Header/>
      </div>
      <div className="navbar-section">
        <Navbar/>
      </div>
      <div className="dashboard">
        <div className="content-center">
          <div className="welcome-message">
            <h2>WELCOME BACK, USER!</h2>
            <p>Here's an overview of your recent activity and quick access to REWS services.</p>
          </div>
          <div className="tickets-overview">
            <div className="ticket-card">
              <div className="ticket-icon open-tickets-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>Open Tickets</span>
              <h3>{openTickets}</h3>
            </div>
            <div className="ticket-card">
              <div className="ticket-icon in-progress-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>In Progress</span>
              <h3>{inProgressTickets}</h3>
            </div>
            <div className="ticket-card">
              <div className="ticket-icon closed-tickets-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Closed Tickets</span>
              <h3>{closedTickets}</h3>
            </div>
          </div>
          
          <div className="services-widget">
            <h2 className="services-title">Our Services</h2>
            <div className="services-grid">
              {Object.entries(servicesData).map(([service, data]) => (
                <div 
                  key={service} 
                  className="service-category"
                >
                  <div className="category-icon">
                    {data.icon}
                  </div>
                  <h3 className="category-title">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
