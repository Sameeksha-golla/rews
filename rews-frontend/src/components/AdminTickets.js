import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import { FaFilter, FaSearch, FaEllipsisV } from 'react-icons/fa';
import '../styles/AdminTickets.css';
import { getCurrentUser } from '../utils/userManager';

const API_URL = 'http://localhost:5001/api/v1';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    // Fetch tickets only once on component mount
    fetchTickets();
    
    // Auto-refresh interval removed to prevent continuous reloading
    // If you want to re-enable this feature later, use a much longer interval (e.g., 30000ms)
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // First get any mock tickets from localStorage to ensure we have the latest data
      const storedMockTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
      console.log('Admin found stored tickets:', storedMockTickets.length);
      
      try {
        const response = await axios.get(`${API_URL}/tickets`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.status === 'success') {
          // Combine API tickets and stored mock tickets, avoiding duplicates
          const apiTickets = response.data.data.tickets || [];
          const combinedTickets = [...apiTickets];
          
          // Add mock tickets that don't exist in API response
          storedMockTickets.forEach(mockTicket => {
            const exists = combinedTickets.some(ticket => ticket._id === mockTicket._id);
            if (!exists) {
              combinedTickets.push(mockTicket);
            }
          });
          
          setTickets(combinedTickets);
          setFilteredTickets(combinedTickets);
        }
      } catch (apiErr) {
        console.error('API Error fetching tickets:', apiErr);
        
        // Use default mock data to supplement stored tickets
        const defaultMockTickets = [
          {
            _id: 'ticket-001',
            ticketId: '1001',
            title: 'Office AC not working',
            description: 'The air conditioning in meeting room 3B is not cooling properly.',
            status: 'Open',
            priority: 'High',
            requesterName: 'John Smith',
            assignedTo: '',
            category: 'Facilities',
            createdAt: new Date('2025-06-25T10:30:00')
          },
          {
            _id: 'ticket-002',
            ticketId: '1002',
            title: 'Request for new monitor',
            description: 'Need a second monitor for development work.',
            status: 'In Progress',
            priority: 'Medium',
            requesterName: 'Sarah Johnson',
            assignedTo: 'Admin User',
            category: 'Equipment',
            createdAt: new Date('2025-06-26T09:15:00')
          },
          {
            _id: 'ticket-003',
            ticketId: '1003',
            title: 'VPN access issue',
            description: 'Unable to connect to VPN from home office.',
            status: 'Open',
            priority: 'Urgent',
            requesterName: 'Michael Brown',
            assignedTo: '',
            category: 'IT Support',
            createdAt: new Date('2025-06-27T08:45:00')
          },
          {
            _id: 'ticket-004',
            ticketId: '1004',
            title: 'Conference room booking',
            description: 'Need to book the main conference room for client meeting.',
            status: 'Closed',
            priority: 'Low',
            requesterName: 'Emily Davis',
            assignedTo: 'Admin User',
            category: 'Booking',
            createdAt: new Date('2025-06-20T14:20:00')
          },
          {
            _id: 'ticket-005',
            ticketId: '1005',
            title: 'Printer not working',
            description: 'The printer on the 2nd floor is showing error code 503.',
            status: 'Resolved',
            priority: 'Medium',
            requesterName: 'David Wilson',
            assignedTo: 'Admin User',
            category: 'Equipment',
            createdAt: new Date('2025-06-22T11:10:00')
          }
        ];
        
        // Combine stored and default mock tickets
        const combinedMockTickets = [...defaultMockTickets, ...storedMockTickets];
        console.log('Admin displaying all mock tickets:', combinedMockTickets);
        
        setTickets(combinedMockTickets);
        setFilteredTickets(combinedMockTickets);
      }
    } catch (err) {
      console.error('Error in fetchTickets:', err);
      setError('Failed to load tickets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tickets];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(term) || 
        ticket.description.toLowerCase().includes(term) ||
        ticket.ticketId.toString().includes(term) ||
        (ticket.requesterName && ticket.requesterName.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(ticket => ticket.priority.toLowerCase() === priorityFilter.toLowerCase());
    }

    setFilteredTickets(result);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setFilterDropdownOpen(false);
  };

  const handlePriorityFilterChange = (priority) => {
    setPriorityFilter(priority);
    setFilterDropdownOpen(false);
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const toggleActionMenu = (ticketId) => {
    setActionMenuOpen(actionMenuOpen === ticketId ? null : ticketId);
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const response = await axios.patch(
        `${API_URL}/tickets/${ticketId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 'success') {
        // Update ticket in state
        const updatedTickets = tickets.map(ticket => 
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        );
        setTickets(updatedTickets);
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      alert('Failed to update ticket status. Please try again.');
    } finally {
      setActionMenuOpen(null);
    }
  };

  const handleAssignTicket = async (ticketId) => {
    navigate(`/admin/assign-ticket/${ticketId}`);
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

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'priority-badge priority-low';
      case 'medium': return 'priority-badge priority-medium';
      case 'high': return 'priority-badge priority-high';
      case 'urgent': return 'priority-badge priority-urgent';
      default: return 'priority-badge';
    }
  };

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-tickets-page">
      <Header />
      <div className="admin-tickets-container">
        <Navbar isAdmin={true} />
        
        <div className="admin-tickets-content">
          <div className="admin-tickets-header">
            <h1>All Tickets</h1>
            <div className="admin-tickets-actions">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
              
              <div className="filter-container">
                <button 
                  className="filter-button"
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                >
                  <FaFilter /> Filter
                </button>
                
                {filterDropdownOpen && (
                  <div className="filter-dropdown">
                    <div className="filter-section">
                      <h4>Status</h4>
                      <div className="filter-options">
                        <div 
                          className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                          onClick={() => handleStatusFilterChange('all')}
                        >
                          All
                        </div>
                        <div 
                          className={`filter-option ${statusFilter === 'open' ? 'active' : ''}`}
                          onClick={() => handleStatusFilterChange('open')}
                        >
                          Open
                        </div>
                        <div 
                          className={`filter-option ${statusFilter === 'in progress' ? 'active' : ''}`}
                          onClick={() => handleStatusFilterChange('in progress')}
                        >
                          In Progress
                        </div>
                        <div 
                          className={`filter-option ${statusFilter === 'resolved' ? 'active' : ''}`}
                          onClick={() => handleStatusFilterChange('resolved')}
                        >
                          Resolved
                        </div>
                        <div 
                          className={`filter-option ${statusFilter === 'closed' ? 'active' : ''}`}
                          onClick={() => handleStatusFilterChange('closed')}
                        >
                          Closed
                        </div>
                      </div>
                    </div>
                    
                    <div className="filter-section">
                      <h4>Priority</h4>
                      <div className="filter-options">
                        <div 
                          className={`filter-option ${priorityFilter === 'all' ? 'active' : ''}`}
                          onClick={() => handlePriorityFilterChange('all')}
                        >
                          All
                        </div>
                        <div 
                          className={`filter-option ${priorityFilter === 'low' ? 'active' : ''}`}
                          onClick={() => handlePriorityFilterChange('low')}
                        >
                          Low
                        </div>
                        <div 
                          className={`filter-option ${priorityFilter === 'medium' ? 'active' : ''}`}
                          onClick={() => handlePriorityFilterChange('medium')}
                        >
                          Medium
                        </div>
                        <div 
                          className={`filter-option ${priorityFilter === 'high' ? 'active' : ''}`}
                          onClick={() => handlePriorityFilterChange('high')}
                        >
                          High
                        </div>
                        <div 
                          className={`filter-option ${priorityFilter === 'urgent' ? 'active' : ''}`}
                          onClick={() => handlePriorityFilterChange('urgent')}
                        >
                          Urgent
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">Loading tickets...</div>
          ) : (
            <>
              {currentTickets.length > 0 ? (
                <div className="admin-tickets-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Requester</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTickets.map(ticket => (
                        <tr key={ticket._id}>
                          <td>#{ticket.ticketId}</td>
                          <td 
                            className="ticket-title"
                            onClick={() => handleTicketClick(ticket._id)}
                          >
                            {ticket.title}
                          </td>
                          <td>{ticket.requesterName}</td>
                          <td>{ticket.category || 'N/A'}</td>
                          <td>{ticket.subCategory || 'N/A'}</td>
                          <td>{ticket.assignedTo || 'Unassigned'}</td>
                          <td>
                            <span className={getStatusBadgeClass(ticket.status)}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            <span className={getPriorityBadgeClass(ticket.priority)}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td>{formatDate(ticket.createdAt)}</td>
                          <td className="actions-cell">
                            <div className="action-menu-container">
                              <button 
                                className="action-menu-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleActionMenu(ticket._id);
                                }}
                              >
                                <FaEllipsisV />
                              </button>
                              
                              {actionMenuOpen === ticket._id && (
                                <div className="action-menu">
                                  <div 
                                    className="action-menu-item"
                                    onClick={() => handleTicketClick(ticket._id)}
                                  >
                                    View Details
                                  </div>
                                  <div className="action-menu-item-group">
                                    <div className="action-menu-item-header">Update Status</div>
                                    <div 
                                      className="action-menu-item"
                                      onClick={() => handleUpdateStatus(ticket._id, 'Open')}
                                    >
                                      Open
                                    </div>
                                    <div 
                                      className="action-menu-item"
                                      onClick={() => handleUpdateStatus(ticket._id, 'In Progress')}
                                    >
                                      In Progress
                                    </div>
                                    <div 
                                      className="action-menu-item"
                                      onClick={() => handleUpdateStatus(ticket._id, 'Resolved')}
                                    >
                                      Resolved
                                    </div>
                                    <div 
                                      className="action-menu-item"
                                      onClick={() => handleUpdateStatus(ticket._id, 'Closed')}
                                    >
                                      Closed
                                    </div>
                                  </div>
                                  <div 
                                    className="action-menu-item"
                                    onClick={() => handleAssignTicket(ticket._id)}
                                  >
                                    Assign Ticket
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-tickets-message">
                  No tickets match your search criteria.
                </div>
              )}
              
              {filteredTickets.length > ticketsPerPage && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
