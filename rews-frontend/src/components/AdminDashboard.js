import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import '../styles/AdminDashboard.css';

// Register the components we need for the chart
ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://localhost:5001/api/v1';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Add React Router's navigate
  const [ticketStats, setTicketStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [totalTickets, setTotalTickets] = useState(0);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    // Only fetch data once on component mount - removed auto-refresh
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // First get all tickets from localStorage to ensure we have the latest data
      const storedTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
      
      // Get admin info from localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.name) {
          setAdminName(parsedUser.name.split(' ')[0]);
        }
      }
      
      let apiTickets = [];
      let combinedTickets = [];
      
      try {
        // Fetch ticket statistics from API
        const token = localStorage.getItem('token');
        const ticketsResponse = await axios.get(`${API_URL}/tickets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (ticketsResponse.data.status === 'success') {
          apiTickets = ticketsResponse.data.data.tickets || [];
          
          // Combine API tickets and stored tickets, avoiding duplicates
          combinedTickets = [...apiTickets];
          
          // Add mock tickets that don't exist in API response
          storedTickets.forEach(mockTicket => {
            const exists = combinedTickets.some(ticket => ticket._id === mockTicket._id);
            if (!exists) {
              combinedTickets.push(mockTicket);
            }
          });
        }
      } catch (apiErr) {
        console.error('API Error fetching tickets:', apiErr);
        // If API fails, use localStorage tickets only
        combinedTickets = [...storedTickets];
      }
      
      // Calculate ticket statistics manually
      let openCount = 0;
      let inProgressCount = 0;
      let resolvedCount = 0;
      let closedCount = 0;
      
      combinedTickets.forEach(ticket => {
        const status = ticket.status ? ticket.status.toLowerCase() : '';
        if (status === 'open' || status === 'new') {
          openCount++;
        } else if (status === 'in progress') {
          inProgressCount++;
        } else if (status === 'resolved') {
          resolvedCount++;
        } else if (status === 'closed') {
          closedCount++;
        }
      });
      
      // Update ticket statistics
      setTicketStats({
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        closed: closedCount
      });
      
      // Update total tickets count
      setTotalTickets(combinedTickets.length);
      
      // Sort tickets by creation date and get the 5 most recent
      const sortedTickets = [...combinedTickets].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      // Set recent tickets (limited to 5)
      setRecentTickets(sortedTickets.slice(0, 5));
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        data: [ticketStats.open, ticketStats.inProgress, ticketStats.resolved, ticketStats.closed],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0'],
        hoverBackgroundColor: ['#FF4C70', '#FFB930', '#1A8FE3', '#3DA8A8']
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'status-badge status-open';
      case 'in progress': return 'status-badge status-progress';
      case 'resolved': return 'status-badge status-resolved';
      case 'closed': return 'status-badge status-closed';
      default: return 'status-badge';
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="admin-dashboard-container">
        <Navbar isAdmin={true} />
        
        <div className="admin-dashboard-content">
          <div className="admin-dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminName}!</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">Loading dashboard data...</div>
          ) : (
            <>
              <div className="admin-stats-cards">
                <div className="admin-stat-card">
                  <h3>Total Tickets</h3>
                  <p className="stat-number">{totalTickets}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Open</h3>
                  <p className="stat-number">{ticketStats.open}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>In Progress</h3>
                  <p className="stat-number">{ticketStats.inProgress}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Resolved</h3>
                  <p className="stat-number">{ticketStats.resolved}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Closed</h3>
                  <p className="stat-number">{ticketStats.closed}</p>
                </div>
              </div>
              
              <div className="admin-dashboard-sections">
                <div className="admin-chart-section">
                  <h2>Ticket Status Distribution</h2>
                  <div className="chart-container">
                    <Pie data={chartData} options={chartOptions} />
                  </div>
                </div>
                
                <div className="admin-recent-tickets">
                  <h2>Recent Tickets</h2>
                  {recentTickets.length > 0 ? (
                    <div className="admin-tickets-table">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Requester</th>
                            <th>Status</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTickets.map(ticket => (
                            <tr 
                              key={ticket._id} 
                              onClick={() => navigate(`/admin/ticket/${ticket._id}`)} 
                              className="ticket-row"
                            >
                              <td>#{ticket.ticketId}</td>
                              <td>{ticket.title}</td>
                              <td>{ticket.requesterName}</td>
                              <td>
                                <span className={getStatusBadgeClass(ticket.status)}>
                                  {ticket.status}
                                </span>
                              </td>
                              <td>{formatDate(ticket.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No recent tickets found.</p>
                  )}
                  
                  <div className="view-all-link">
                    <a href="/admin/tickets">View All Tickets →</a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
