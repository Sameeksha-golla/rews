import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaTag, 
  FaExclamationCircle, 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaPaperclip,
  FaDownload
} from 'react-icons/fa';
import '../styles/AdminTicketDetail.css';
import { updateTicketInStorage, addCommentToTicket, getTicketFromStorage } from '../utils/ticketSync';

const API_URL = 'http://localhost:5001/api/v1';

const AdminTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [statusOptions] = useState(['Open', 'In Progress', 'Resolved', 'Closed']);
  const [priorityOptions] = useState(['Low', 'Medium', 'High', 'Urgent']);
  const [adminComment, setAdminComment] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  // Editable ticket fields
  const [editedTicket, setEditedTicket] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    adminNotes: ''
  });

  useEffect(() => {
    fetchTicket();
    fetchAssignees();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.status === 'success') {
          const ticketData = response.data.data.ticket;
          setTicket(ticketData);
          setEditedTicket({
            status: ticketData.status,
            priority: ticketData.priority,
            assignedTo: ticketData.assignedTo || '',
            adminNotes: ticketData.adminNotes || ''
          });
        }
      } catch (apiErr) {
        console.error('API Error fetching ticket:', apiErr);
        
        // First check if this is a user-created ticket in localStorage using our sync utility
        const userCreatedTicket = getTicketFromStorage(ticketId);
        
        if (userCreatedTicket) {
          console.log('Found user-created ticket:', userCreatedTicket);
          
          // Add comments array if it doesn't exist
          if (!userCreatedTicket.comments) {
            userCreatedTicket.comments = [];
          }
          
          // Add attachments array if it doesn't exist
          if (!userCreatedTicket.attachments) {
            userCreatedTicket.attachments = [];
          }
          
          setTicket(userCreatedTicket);
          setEditedTicket({
            status: userCreatedTicket.status,
            priority: userCreatedTicket.priority,
            assignedTo: userCreatedTicket.assignedTo || '',
            adminNotes: userCreatedTicket.adminNotes || ''
          });
          
          return;
        }
        
        // If not found in localStorage, use default mock data
        const mockTickets = {
          'ticket-001': {
            _id: 'ticket-001',
            ticketId: '1001',
            title: 'Office AC not working',
            description: 'The air conditioning in meeting room 3B is not cooling properly. It was working fine yesterday, but today it seems to be blowing warm air. We have an important client meeting scheduled for tomorrow afternoon, so this needs to be fixed urgently.',
            status: 'Open',
            priority: 'High',
            requesterName: 'John Smith',
            requesterEmail: 'john.smith@example.com',
            assignedTo: '',
            adminNotes: '',
            category: 'Facilities',
            comments: [
              {
                _id: 'comment-001',
                content: "I have submitted this ticket because the AC in meeting room 3B is not working properly.",
                isAdminComment: false,
                createdAt: new Date('2025-06-25T10:35:00')
              }
            ],
            createdAt: new Date('2025-06-25T10:30:00')
          },
          'ticket-002': {
            _id: 'ticket-002',
            ticketId: '1002',
            title: 'Request for new monitor',
            description: 'Need a second monitor for development work. My current setup with just one monitor is limiting my productivity. A second monitor would help me manage multiple code windows simultaneously.',
            status: 'In Progress',
            priority: 'Medium',
            requesterName: 'Sarah Johnson',
            requesterEmail: 'sarah.johnson@example.com',
            assignedTo: 'Admin User',
            adminNotes: 'Checking inventory for available monitors. Will need approval from department head.',
            category: 'Equipment',
            comments: [
              {
                _id: 'comment-002-1',
                content: "I have submitted this request for a second monitor to improve my development workflow.",
                isAdminComment: false,
                createdAt: new Date('2025-06-26T09:20:00')
              },
              {
                _id: 'comment-002-2',
                content: "We are checking inventory and will get back to you shortly.",
                isAdminComment: true,
                createdAt: new Date('2025-06-26T10:15:00')
              }
            ],
            createdAt: new Date('2025-06-26T09:15:00')
          },
          'ticket-003': {
            _id: 'ticket-003',
            ticketId: '1003',
            title: 'VPN access issue',
            description: "Unable to connect to VPN from home office. I have tried restarting my computer and router, but still getting a connection error. Need this resolved ASAP as I have important work to complete remotely.",
            status: 'Open',
            priority: 'Urgent',
            requesterName: 'Michael Brown',
            requesterEmail: 'michael.brown@example.com',
            assignedTo: '',
            adminNotes: '',
            category: 'IT Support',
            comments: [],
            createdAt: new Date('2025-06-27T08:45:00')
          },
          'ticket-004': {
            _id: 'ticket-004',
            ticketId: '1004',
            title: 'Conference room booking',
            description: 'Need to book the main conference room for client meeting on July 2nd from 2-4 PM.',
            status: 'Closed',
            priority: 'Low',
            requesterName: 'Emily Davis',
            requesterEmail: 'emily.davis@example.com',
            assignedTo: 'Admin User',
            adminNotes: 'Booking confirmed and added to calendar.',
            category: 'Booking',
            comments: [
              {
                _id: 'comment-004-1',
                content: 'Booking confirmed for July 2nd, 2-4 PM.',
                isAdminComment: true,
                createdAt: new Date('2025-06-20T15:10:00')
              },
              {
                _id: 'comment-004-2',
                content: 'Thank you for the confirmation!',
                isAdminComment: false,
                createdAt: new Date('2025-06-20T15:30:00')
              }
            ],
            createdAt: new Date('2025-06-20T14:20:00')
          },
          'ticket-005': {
            _id: 'ticket-005',
            ticketId: '1005',
            title: 'Printer not working',
            description: "The printer on the 2nd floor is showing error code 503. I have tried turning it off and on again, but the error persists.",
            status: 'Resolved',
            priority: 'Medium',
            requesterName: 'David Wilson',
            requesterEmail: 'david.wilson@example.com',
            assignedTo: 'Admin User',
            adminNotes: 'Printer needed toner replacement and paper jam removal.',
            category: 'Equipment',
            comments: [
              {
                _id: 'comment-005-1',
                content: 'IT support has been dispatched to check the printer.',
                isAdminComment: true,
                createdAt: new Date('2025-06-22T11:30:00')
              },
              {
                _id: 'comment-005-2',
                content: 'Issue resolved - replaced toner and cleared paper jam.',
                isAdminComment: true,
                createdAt: new Date('2025-06-22T13:15:00')
              }
            ],
            createdAt: new Date('2025-06-22T11:10:00')
          }
        };
        
        // Get the specific ticket based on the ID from the URL
        const mockTicket = mockTickets[ticketId] || mockTickets['ticket-001'];
        
        setTicket(mockTicket);
        setEditedTicket({
          status: mockTicket.status,
          priority: mockTicket.priority,
          assignedTo: mockTicket.assignedTo || '',
          adminNotes: mockTicket.adminNotes || ''
        });
      }
    } catch (err) {
      console.error('Error in fetchTicket:', err);
      setError('Failed to load ticket details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    try {
      setLoadingAssignees(true);
      // This would typically fetch admin users who can be assigned tickets
      const response = await axios.get(`${API_URL}/auth/admins`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        setAssignees(response.data.data.admins);
      }
    } catch (err) {
      console.error('Error fetching assignees:', err);
    } finally {
      setLoadingAssignees(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset edited values to current ticket values when entering edit mode
      setEditedTicket({
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo || '',
        adminNotes: ticket.adminNotes || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      setLoading(true);
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
          setTicket(prevTicket => ({
            ...prevTicket,
            status: newStatus
          }));
          setEditedTicket(prevState => ({
            ...prevState,
            status: newStatus
          }));
        }
      } catch (apiErr) {
        console.error('API Error updating ticket status:', apiErr);
        
        // Update the UI optimistically even if the API call fails
        setTicket(prevTicket => ({
          ...prevTicket,
          status: newStatus
        }));
        setEditedTicket(prevState => ({
          ...prevState,
          status: newStatus
        }));
        
        // Update the ticket in localStorage using our sync utility
        updateTicketInStorage(ticketId, { status: newStatus });
      }
    } catch (err) {
      console.error('Error in handleUpdateStatus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      try {
        const response = await axios.patch(
          `${API_URL}/tickets/${ticketId}`,
          editedTicket,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.status === 'success') {
          setTicket(prevTicket => ({
            ...prevTicket,
            ...editedTicket
          }));
          setEditMode(false);
        }
      } catch (apiErr) {
        console.error('API Error saving ticket changes:', apiErr);
        
        // Update the UI optimistically even if the API call fails
        setTicket(prevTicket => ({
          ...prevTicket,
          ...editedTicket
        }));
        
        // Update the ticket in localStorage using our sync utility
        updateTicketInStorage(ticketId, {
          status: editedTicket.status,
          priority: editedTicket.priority,
          assignedTo: editedTicket.assignedTo,
          adminNotes: editedTicket.adminNotes
        });
        
        setEditMode(false);
      }
    } catch (err) {
      console.error('Error in handleSaveChanges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!adminComment.trim()) return;
    
    try {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/tickets/${ticketId}/comments`,
          { content: adminComment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.status === 'success') {
          const newComment = response.data.data.comment;
          setTicket(prevTicket => ({
            ...prevTicket,
            comments: [...(prevTicket.comments || []), newComment]
          }));
          setAdminComment('');
        }
      } catch (apiErr) {
        console.error('API Error adding comment:', apiErr);
        // Create a mock comment
        const mockComment = {
          _id: `comment-${Date.now()}`,
          content: adminComment,
          isAdminComment: true,
          createdAt: new Date()
        };
        
        // Update the UI optimistically even if the API call fails
        setTicket(prevTicket => ({
          ...prevTicket,
          comments: [...(prevTicket.comments || []), mockComment]
        }));
        
        // Add the comment to the ticket in localStorage using our sync utility
        addCommentToTicket(ticketId, mockComment);
        
        setAdminComment('');
      }
    } catch (err) {
      console.error('Error in handleAddComment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttachment = (attachmentId, filename) => {
    window.open(`${API_URL}/tickets/${ticketId}/attachments/${attachmentId}`, '_blank');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  // Get file icon based on file extension
  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return 'file-pdf';
      case 'doc':
      case 'docx': return 'file-word';
      case 'xls':
      case 'xlsx': return 'file-excel';
      case 'ppt':
      case 'pptx': return 'file-powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'file-image';
      default: return 'file';
    }
  };

  return (
    <div className="admin-ticket-detail-page">
      <Header />
      <div className="admin-ticket-detail-container">
        <Navbar isAdmin={true} />
        
        <div className="admin-ticket-detail-content">
          <div className="admin-ticket-detail-header">
            <div className="back-button" onClick={() => navigate('/admin/tickets')}>
              ← Back to All Tickets
            </div>
            
            {!loading && !error && ticket && (
              <div className="admin-ticket-actions">
                {editMode ? (
                  <>
                    <button className="cancel-button" onClick={handleEditToggle}>
                      <FaTimes /> Cancel
                    </button>
                    <button className="save-button" onClick={handleSaveChanges}>
                      <FaCheck /> Save Changes
                    </button>
                  </>
                ) : (
                  <button className="edit-button" onClick={handleEditToggle}>
                    <FaEdit /> Edit Ticket
                  </button>
                )}
              </div>
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">Loading ticket details...</div>
          ) : ticket ? (
            <div className="admin-ticket-detail-body">
              <div className="admin-ticket-main-info">
                <h1>
                  #{ticket.ticketId}: {ticket.title}
                </h1>
                
                <div className="admin-ticket-meta">
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    <span className="meta-label">Requester:</span>
                    <span className="meta-value">{ticket.requesterName || 'Anonymous'}</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{formatDate(ticket.createdAt)}</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaTag className="meta-icon" />
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{ticket.category || 'N/A'}</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaTag className="meta-icon" />
                    <span className="meta-label">Subcategory:</span>
                    <span className="meta-value">{ticket.subCategory || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="admin-ticket-status-section">
                  <div className="status-item">
                    <span className="status-label">Status:</span>
                    {editMode ? (
                      <select 
                        name="status" 
                        value={editedTicket.status} 
                        onChange={handleInputChange}
                        className="status-select"
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={getStatusBadgeClass(ticket.status)}>
                        {ticket.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Priority:</span>
                    {editMode ? (
                      <select 
                        name="priority" 
                        value={editedTicket.priority} 
                        onChange={handleInputChange}
                        className="priority-select"
                      >
                        {priorityOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={getPriorityBadgeClass(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    )}
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Assigned To:</span>
                    {editMode ? (
                      <select 
                        name="assignedTo" 
                        value={editedTicket.assignedTo} 
                        onChange={handleInputChange}
                        className="assignee-select"
                        disabled={loadingAssignees}
                      >
                        <option value="">Unassigned</option>
                        {assignees.map(admin => (
                          <option key={admin._id} value={admin.name}>{admin.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="assignee-value">
                        {ticket.assignedTo || 'Unassigned'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="admin-ticket-description">
                  <h3>Description</h3>
                  <div className="description-content">
                    {ticket.description}
                  </div>
                </div>
                
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="admin-ticket-attachments">
                    <h3>Attachments</h3>
                    <div className="attachments-list">
                      {ticket.attachments.map(attachment => (
                        <div 
                          key={attachment._id} 
                          className="attachment-item"
                          onClick={() => handleDownloadAttachment(attachment._id, attachment.filename)}
                        >
                          <FaPaperclip className="attachment-icon" />
                          <span className="attachment-name">{attachment.filename}</span>
                          <FaDownload className="download-icon" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="admin-ticket-notes">
                  <h3>Admin Notes</h3>
                  {editMode ? (
                    <textarea
                      name="adminNotes"
                      value={editedTicket.adminNotes}
                      onChange={handleInputChange}
                      placeholder="Add internal notes about this ticket (only visible to admins)"
                      className="admin-notes-textarea"
                      rows={4}
                    />
                  ) : (
                    <div className="admin-notes-content">
                      {ticket.adminNotes || 'No admin notes added yet.'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="admin-ticket-comments">
                <h3>Comments</h3>
                
                <div className="comments-list">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    ticket.comments.map(comment => (
                      <div 
                        key={comment._id} 
                        className={`comment-item ${comment.isAdminComment ? 'admin-comment' : 'user-comment'}`}
                      >
                        <div className="comment-header">
                          <div className="comment-author">
                            {comment.isAdminComment ? 'Admin' : ticket.requesterName || 'Requester'}
                            {comment.isAdminComment && <span className="admin-badge">Staff</span>}
                          </div>
                          <div className="comment-date">{formatDate(comment.createdAt)}</div>
                        </div>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-comments">No comments yet.</div>
                  )}
                </div>
                
                <div className="add-comment-section">
                  <h4>Add Admin Comment</h4>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Type your comment here..."
                    className="comment-textarea"
                    rows={3}
                  />
                  <button 
                    className="add-comment-button"
                    onClick={handleAddComment}
                    disabled={!adminComment.trim()}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="not-found-message">
              <FaExclamationCircle className="not-found-icon" />
              <h2>Ticket Not Found</h2>
              <p>The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
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

export default AdminTicketDetail;
