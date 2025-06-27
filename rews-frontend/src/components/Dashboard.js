import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // Initialize ticket counts with 0
  const [openTickets, setOpenTickets] = useState(3);
  const [inProgressTickets, setInProgressTickets] = useState(2);
  const [closedTickets, setClosedTickets] = useState(7);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('USER');
  const [animateCount, setAnimateCount] = useState(true);
  
  // We're using static data now to avoid errors
  useEffect(() => {
    // Get user info from localStorage if available
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        if (parsedInfo.name) {
          setUserName(parsedInfo.name.split(' ')[0]);
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);
  
  // Function to animate counting up
  const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!animateCount) return;
      
      let startTime;
      let animationFrame;
      
      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        if (progress < duration) {
          const nextCount = Math.min(Math.floor((progress / duration) * end), end);
          setCount(nextCount);
          animationFrame = requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
      
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, animateCount]);
    
    return <>{count}</>;
  };

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
    <div className="dashboard-container">
      <div className="header-section">
        <Header />
      </div>
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="dashboard">
        <div className="content-center">
          {loading ? (
            <div className="welcome-message loading-pulse">
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder small"></div>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>WELCOME BACK, {userName}!</h2>
              <p>Here's an overview of your recent activity and quick access to REWS services.</p>
            </div>
          )}
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
              <span>OPEN TICKETS</span>
              <h3>{loading ? <div className="loading-number"></div> : <AnimatedCounter end={openTickets} />}</h3>
            </div>
            <div className="ticket-card">
              <div className="ticket-icon in-progress-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>IN PROGRESS</span>
              <h3>{loading ? <div className="loading-number"></div> : <AnimatedCounter end={inProgressTickets} />}</h3>
            </div>
            <div className="ticket-card">
              <div className="ticket-icon closed-tickets-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>CLOSED TICKETS</span>
              <h3>{loading ? <div className="loading-number"></div> : <AnimatedCounter end={closedTickets} />}</h3>
            </div>
          </div>
          
          <div className="services-widget">
            <h2 className="services-title">Our Services</h2>
            <div className="services-grid">
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=badge'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 16L12 12L17 16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Badge & Security</h3>
              </div>
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=operations'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Operations</h3>
              </div>
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=events'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Event Support</h3>
              </div>
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=travel'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7.5,12 12,15.5 16.5,12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Travel & Accommodation</h3>
              </div>
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=concierge'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
                    <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Concierge Services</h3>
              </div>
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=lost'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                    <path d="M11 8a3 3 0 1 1 0 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Lost & Found</h3>
              </div>
              <div className="service-category" onClick={() => window.location.href = '/create-ticket?category=stationery'} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Stationery & Business Cards</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
