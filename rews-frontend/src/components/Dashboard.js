import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import { FaTimes } from 'react-icons/fa';
import { getCurrentUser } from '../utils/userManager';
import '../styles/Dashboard.css';

const API_URL = 'http://localhost:5001/api/v1';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is admin and redirect to admin dashboard if needed
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate]);
  // Initialize ticket counts with 0
  const [openTickets, setOpenTickets] = useState(0);
  const [inProgressTickets, setInProgressTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('USER');
  const [animateCount, setAnimateCount] = useState(false);
  const [error, setError] = useState('');
  
  // State for subcategory popup
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  
  // Fetch tickets and update counts
  useEffect(() => {
    // Get current user information
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserName(currentUser.name.split(' ')[0] || 'User');
      fetchTickets(currentUser);
    }
  }, []);
  
  // Function to fetch tickets and calculate counts
  const fetchTickets = async (currentUser) => {
    try {
      setLoading(true);
      let userTickets = [];
      
      try {
        // Try to get tickets from API
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Filter tickets for current user
        const apiTickets = response.data.data.tickets || [];
        userTickets = apiTickets.filter(ticket => ticket.requesterEmail === currentUser.email);
        
      } catch (apiErr) {
        console.error('API Error fetching tickets:', apiErr);
        
        // Fallback to localStorage tickets
        const storedTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
        userTickets = storedTickets.filter(ticket => ticket.requesterEmail === currentUser.email);
      }
      
      // Count tickets by status
      let open = 0;
      let inProgress = 0;
      let closed = 0;
      
      userTickets.forEach(ticket => {
        const status = ticket.status ? ticket.status.toLowerCase() : '';
        if (status === 'open' || status === 'new') {
          open++;
        } else if (status === 'in progress') {
          inProgress++;
        } else if (status === 'closed' || status === 'resolved') {
          closed++;
        }
      });
      
      // Update state
      setOpenTickets(open);
      setInProgressTickets(inProgress);
      setClosedTickets(closed);
      setAnimateCount(true);
      
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to load ticket data');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to animate counting up
  const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      // Simplified animation - just set the final count immediately
      // to prevent excessive re-renders
      setCount(end);
      
      // Original animation code (commented out to prevent continuous reloading)
      /*
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
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
      */
    }, [end]); // Only depend on the end value
    
    return <>{count}</>;
  };

  // Service subcategories data
  const serviceSubcategories = {
    "Badge & Security": [
      "New Badge Request",
      "Badge Replacement",
      "Access Control Issues",
      "Security Concerns",
      "Visitor Passes"
    ],
    "Operations": [
      "Building Maintenance",
      "HVAC Issues",
      "Electrical Problems",
      "Plumbing Services",
      "Office Furniture"
    ],
    "Event Support": [
      "Conference Room Booking",
      "Event Setup",
      "Audio/Visual Support",
      "Catering Services",
      "Post-Event Cleanup"
    ],
    "Travel & Accommodation": [
      "Business Travel Request",
      "Hotel Booking",
      "Transportation",
      "Travel Expense Reimbursement",
      "Travel Policy Inquiries"
    ],
    "Concierge Services": [
      "Mail & Package Handling",
      "Reception Services",
      "VIP Support",
      "Guest Management",
      "Information Requests"
    ],
    "Lost & Found": [
      "Report Lost Item",
      "Claim Found Item",
      "Search Request"
    ],
    "Stationery & Business Cards": [
      "Stationery Request",
      "Business Card Order",
      "Branded Materials",
      "Office Supplies",
      "Printing Services"
    ]
  };
  
  // Handle service category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSubcategories(serviceSubcategories[category] || []);
    setShowSubcategories(true);
  };
  
  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    // Create a URL-friendly version of the subcategory
    const encodedSubcategory = encodeURIComponent(subcategory);
    window.location.href = `/create-ticket?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodedSubcategory}`;
  };
  
  // Close the subcategories popup
  const closeSubcategoriesPopup = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
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
              <div className="service-category" onClick={() => handleCategoryClick('Badge & Security')} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 16L12 12L17 16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Badge & Security</h3>
              </div>
              <div className="service-category" onClick={() => handleCategoryClick('Operations')} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Operations</h3>
              </div>
              <div className="service-category" onClick={() => handleCategoryClick('Event Support')} role="button" tabIndex="0">
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
              <div className="service-category" onClick={() => handleCategoryClick('Travel & Accommodation')} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7.5,12 12,15.5 16.5,12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Travel & Accommodation</h3>
              </div>
              <div className="service-category" onClick={() => handleCategoryClick('Concierge Services')} role="button" tabIndex="0">
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
              <div className="service-category" onClick={() => handleCategoryClick('Lost & Found')} role="button" tabIndex="0">
                <div className="category-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                    <path d="M11 8a3 3 0 1 1 0 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="category-title">Lost & Found</h3>
              </div>
              <div className="service-category" onClick={() => handleCategoryClick('Stationery & Business Cards')} role="button" tabIndex="0">
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
            
            {/* Subcategories Popup */}
            {showSubcategories && (
              <div className="subcategories-popup-overlay">
                <div className="subcategories-popup">
                  <div className="subcategories-header">
                    <h3>{selectedCategory} - Select Subcategory</h3>
                    <button className="close-btn" onClick={closeSubcategoriesPopup}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="subcategories-list">
                    {subcategories.map((subcategory, index) => (
                      <div 
                        key={index} 
                        className="subcategory-item" 
                        onClick={() => handleSubcategorySelect(subcategory)}
                      >
                        {subcategory}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
