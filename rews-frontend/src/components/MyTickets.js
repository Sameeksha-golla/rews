import React, { useState, useEffect } from 'react';
import "../styles/MyTickets.css";
import Header from "./Header";
import Navbar from "./Navbar";
import axios from "axios";
import { getToken } from "../utils/auth";
import { getCurrentUser } from "../utils/userManager";
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaDownload, FaTicketAlt, FaSearch, FaFilter } from "react-icons/fa";

// Helper function to get appropriate icon based on file extension
const getFileIcon = (filename) => {
  if (!filename) return <FaFile />;
  
  const extension = filename.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FaFilePdf />;
    case 'doc':
    case 'docx':
      return <FaFileWord />;
    case 'xls':
    case 'xlsx':
      return <FaFileExcel />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FaFileImage />;
    default:
      return <FaFile />;
  }
};

// Helper function to truncate long filenames
const truncateFileName = (filename, maxLength = 20) => {
  if (!filename) return '';
  
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.includes('.') ? 
    filename.substring(filename.lastIndexOf('.')) : '';
  
  const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
  
  return `${nameWithoutExtension.substring(0, maxLength - extension.length - 3)}...${extension}`;
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketIdSearch, setTicketIdSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  // Function to handle file viewing/downloads with authentication
  const handleFileClick = async (ticketId, fileName, fileType) => {
    try {
      const token = getToken();
      
      // Check if this is a viewable file type
      const viewableTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'text/plain', 'text/html',
        'video/mp4'
      ];
      
      const isViewable = viewableTypes.some(type => 
        fileType ? fileType.includes(type) : false
      );
      
      if (isViewable) {
        // Open in a new tab for viewable files
        const url = `http://localhost:5001/api/v1/tickets/files/${ticketId}`;
        const newWindow = window.open('', '_blank');
        
        if (newWindow) {
          // Create a form to submit with the token
          const form = document.createElement('form');
          form.method = 'GET';
          form.action = url;
          form.target = '_blank';
          
          // Add token as a hidden input
          const tokenInput = document.createElement('input');
          tokenInput.type = 'hidden';
          tokenInput.name = 'token';
          tokenInput.value = token;
          form.appendChild(tokenInput);
          
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          alert('Pop-up blocked. Please allow pop-ups for this site to view files.');
        }
      } else {
        // Download non-viewable files
        const response = await axios({
          url: `http://localhost:5001/api/v1/tickets/files/${ticketId}`,
          method: 'GET',
          responseType: 'blob', // Important for handling binary data
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Create a blob URL and trigger download
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error handling file:', error);
      alert('Failed to access file. Please try again.');
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Get current user information
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('No user logged in');
        setTickets([]);
        setLoading(false);
        return;
      }
      
      // First get any mock tickets from localStorage to ensure we have the latest data
      const storedMockTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
      
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:5001/api/v1/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Filter tickets to only show those created by the current user
        const allTickets = response.data.data.tickets || [];
        const apiUserTickets = allTickets.filter(ticket => {
          return ticket.requesterEmail === currentUser.email;
        });
        
        // Filter mock tickets for the current user
        const mockUserTickets = storedMockTickets.filter(ticket => {
          return ticket.requesterEmail === currentUser.email;
        });
        
        // Combine API tickets and mock tickets, avoiding duplicates
        const combinedTickets = [...apiUserTickets];
        
        // Add mock tickets that don't exist in API response
        mockUserTickets.forEach(mockTicket => {
          const exists = combinedTickets.some(ticket => ticket._id === mockTicket._id);
          if (!exists) {
            combinedTickets.push(mockTicket);
          }
        });
        
        console.log(`Found ${combinedTickets.length} tickets for user ${currentUser.email}`);
        setTickets(combinedTickets);
      } catch (apiErr) {
        console.error("API Error fetching tickets:", apiErr);
        
        // Filter mock tickets for the current user
        const userTickets = storedMockTickets.filter(ticket => {
          return ticket.requesterEmail === currentUser.email;
        });
          
        console.log(`Displaying ${userTickets.length} mock tickets for user ${currentUser.email}`);
        setTickets(userTickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch tickets on mount, don't set up auto-refresh to prevent excessive reloads
  useEffect(() => {
    fetchTickets();
    
    // No auto-refresh interval - this may have been causing the continuous reloading
    // Uncomment if you need this feature after fixing the reloading issue
    /*
    const intervalId = setInterval(() => {
      fetchTickets();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
    */
  }, []);

  // Filter tickets based on search term, categories, statuses, and date range
  const filteredTickets = tickets.filter(ticket => {
    // Filter by ticket ID search
    const matchesSearch = ticketIdSearch === '' || 
      (ticket._id && ticket._id.toLowerCase().includes(ticketIdSearch.toLowerCase()));
    
    // Filter by selected categories
    const matchesCategory = selectedCategories.length === 0 || 
      (ticket.subCategory && selectedCategories.includes(ticket.subCategory));
    
    // Filter by selected statuses - assuming we have a status field
    const matchesStatus = selectedStatuses.length === 0 || 
      (ticket.status && selectedStatuses.includes(ticket.status));
    
    // Filter by date range - would need to implement isWithinDateRange function
    // For now, we'll just return true for all tickets
    const matchesDateRange = true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
  });

  return (
    <div>
      <div className="header-section">
        <Header />
      </div>
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="my-tickets-page">
        <div className="content-center">
          <div className="my-tickets-container">
            <div className="tickets-header">
              <h1>My Tickets</h1>
              <div className="filter-controls">
                <div className="search-filter">
                  <div className="ticket-search">
                    <input
                      type="text"
                      placeholder="Search by Ticket ID"
                      value={ticketIdSearch}
                      onChange={(e) => setTicketIdSearch(e.target.value)}
                      className="ticket-search-input"
                    />
                    {/* Date Range Dropdown */}
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="sort-select"
                    >
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Last 60 Days">Last 60 Days</option>
                      <option value="Last 90 Days">Last 90 Days</option>
                      <option value="All">All</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Tickets table */}
            <div className="tickets-table-wrapper">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="no-tickets">
                  <FaTicketAlt className="no-tickets-icon" />
                  <h2>No Tickets Yet</h2>
                  <p>
                    Create your first ticket to get started with REWS services.
                  </p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="no-tickets">
                  <h2>No Matching Tickets</h2>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((data, index) => (
                      <tr key={index}>
                        <td className="ticket-id">{data._id}</td>
                        <td className="ticket-title">{data.title}</td>
                        <td className="ticket-category">
                          {data.category || "N/A"}
                        </td>
                        <td className="ticket-subcategory">
                          {data.subCategory || "N/A"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${(data.status || "new")
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {data.status || "NEW"}
                          </span>
                        </td>
                        <td className="ticket-date">
                          {new Date(data.createdAt).toLocaleDateString()}
                        </td>
                        <td className="ticket-attachment">
                          {data.fileName || data.hasFile ? (
                            <div className="attachment-item">
                              <span className="attachment-icon">📎</span>
                              <button
                                onClick={() =>
                                  handleFileClick(
                                    data._id,
                                    data.fileName,
                                    data.fileContentType
                                  )
                                }
                                className="file-link"
                                title={data.fileName || "View attachment"}
                              >
                                <span className="attachment-name">
                                  {truncateFileName(data.fileName || "File")}
                                </span>
                              </button>
                            </div>
                          ) : (
                            <span className="no-attachment">No attachment</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
