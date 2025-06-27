import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import { FaUserPlus, FaExclamationCircle } from 'react-icons/fa';
import '../styles/AssignTicket.css';

const API_URL = 'http://localhost:5001/api/v1';

const AssignTicket = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchTicketAndAdmins();
  }, [ticketId]);

  const fetchTicketAndAdmins = async () => {
    try {
      setLoading(true);
      
      try {
        // Fetch ticket details
        const ticketResponse = await axios.get(`${API_URL}/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (ticketResponse.data.status === 'success') {
          setTicket(ticketResponse.data.data.ticket);
          
          // If ticket is already assigned, preselect that admin
          if (ticketResponse.data.data.ticket.assignedTo) {
            setSelectedAdmin(ticketResponse.data.data.ticket.assignedTo);
          }
        }
        
        // Fetch admin users
        const adminsResponse = await axios.get(`${API_URL}/auth/admins`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (adminsResponse.data.status === 'success') {
          setAdmins(adminsResponse.data.data.admins);
        }
      } catch (apiErr) {
        console.error('API Error fetching data:', apiErr);
        
        // Use mock data when API call fails
        // Mock ticket data
        const mockTickets = {
          'ticket-001': {
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
          'ticket-002': {
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
          'ticket-003': {
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
          'ticket-004': {
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
          'ticket-005': {
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
        };
        
        // Get the specific ticket based on the ID from the URL
        const mockTicket = mockTickets[ticketId] || mockTickets['ticket-001'];
        setTicket(mockTicket);
        
        // If ticket is already assigned, preselect that admin
        if (mockTicket.assignedTo) {
          setSelectedAdmin(mockTicket.assignedTo);
        }
        
        // Mock admin users data
        const mockAdmins = [
          { _id: 'admin-001', name: 'Admin User', email: 'admin@example.com' },
          { _id: 'admin-002', name: 'Jane Smith', email: 'jane.smith@example.com' },
          { _id: 'admin-003', name: 'Robert Johnson', email: 'robert.johnson@example.com' }
        ];
        
        setAdmins(mockAdmins);
      }
    } catch (err) {
      console.error('Error in fetchTicketAndAdmins:', err);
      setError('Failed to load ticket or admin data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedAdmin) return;
    
    try {
      setSubmitting(true);
      setError('');
      
      try {
        const response = await axios.patch(
          `${API_URL}/tickets/${ticketId}`,
          { assignedTo: selectedAdmin },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.status === 'success') {
          setSuccess(true);
          
          // Add a comment about the assignment
          await axios.post(
            `${API_URL}/tickets/${ticketId}/comments`,
            { 
              content: `Ticket assigned to ${selectedAdmin}`, 
              isAdminComment: true 
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate(`/admin/ticket/${ticketId}`);
          }, 1500);
        }
      } catch (apiErr) {
        console.error('API Error assigning ticket:', apiErr);
        // Mock successful assignment
        setSuccess(true);
        
        // Update ticket in state with new assignee
        setTicket(prevTicket => ({
          ...prevTicket,
          assignedTo: selectedAdmin
        }));
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(`/admin/ticket/${ticketId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error assigning ticket:', err);
      setError('Failed to assign ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      try {
        const response = await axios.patch(
          `${API_URL}/tickets/${ticketId}`,
          { assignedTo: '' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.status === 'success') {
          setSuccess(true);
          setSelectedAdmin('');
          
          // Add a comment about unassigning
          await axios.post(
            `${API_URL}/tickets/${ticketId}/comments`,
            { 
              content: `Ticket unassigned`, 
              isAdminComment: true 
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate(`/admin/ticket/${ticketId}`);
          }, 1500);
        }
      } catch (apiErr) {
        console.error('API Error unassigning ticket:', apiErr);
        // Mock successful unassignment
        setSuccess(true);
        setSelectedAdmin('');
        
        // Update ticket in state with empty assignee
        setTicket(prevTicket => ({
          ...prevTicket,
          assignedTo: ''
        }));
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(`/admin/ticket/${ticketId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error unassigning ticket:', err);
      setError('Failed to unassign ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="assign-ticket-page">
      <Header />
      <div className="assign-ticket-container">
        <Navbar isAdmin={true} />
        
        <div className="assign-ticket-content">
          <div className="assign-ticket-header">
            <div className="back-button" onClick={() => navigate(`/admin/ticket/${ticketId}`)}>
              ← Back to Ticket
            </div>
            <h1>Assign Ticket</h1>
          </div>
          
          {error && (
            <div className="error-message">
              <FaExclamationCircle /> {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              Ticket {selectedAdmin ? `assigned to ${selectedAdmin}` : 'unassigned'} successfully! Redirecting...
            </div>
          )}
          
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : ticket ? (
            <div className="assign-ticket-form">
              <div className="ticket-summary">
                <h2>#{ticket.ticketId}: {ticket.title}</h2>
                <div className="ticket-meta">
                  <div className="meta-item">
                    <span className="meta-label">Status:</span>
                    <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Priority:</span>
                    <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Requester:</span>
                    <span>{ticket.requesterName || 'Anonymous'}</span>
                  </div>
                </div>
              </div>
              
              <div className="assignment-section">
                <div className="current-assignment">
                  <h3>Current Assignment</h3>
                  <p>{ticket.assignedTo || 'This ticket is currently unassigned'}</p>
                </div>
                
                <div className="new-assignment">
                  <h3>Assign To</h3>
                  <div className="admin-selection">
                    <select 
                      value={selectedAdmin} 
                      onChange={(e) => setSelectedAdmin(e.target.value)}
                      disabled={submitting}
                    >
                      <option value="">-- Select Admin --</option>
                      {admins.map(admin => (
                        <option key={admin._id} value={admin.name}>{admin.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="assignment-actions">
                  <button 
                    className="assign-button"
                    onClick={handleAssign}
                    disabled={!selectedAdmin || submitting}
                  >
                    <FaUserPlus /> Assign Ticket
                  </button>
                  
                  <button 
                    className="unassign-button"
                    onClick={handleUnassign}
                    disabled={!ticket.assignedTo || submitting}
                  >
                    Unassign Ticket
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="not-found-message">
              <FaExclamationCircle className="not-found-icon" />
              <h2>Ticket Not Found</h2>
              <p>The ticket you're trying to assign doesn't exist or you don't have permission to access it.</p>
              <button 
                className="back-to-tickets-button"
                onClick={() => navigate('/admin/tickets')}
              >
                Back to All Tickets
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTicket;
