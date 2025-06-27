import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import '../styles/CreateTicket.css';
import axios from "axios";
import { getToken } from "../utils/auth";
import { getCurrentUser } from "../utils/userManager";
import { FaTicketAlt, FaPaperclip, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  // Check if user is logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // Redirect to login if no user is logged in
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubCategory(''); // Reset subcategory when category changes
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Make sure user is logged in
    if (!currentUser) {
      setError('You must be logged in to create a ticket');
      setLoading(false);
      return;
    }

    try {      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("priority", priority);
      formData.append("description", description);
      formData.append("requesterName", currentUser.name);
      formData.append("requesterEmail", currentUser.email);
      formData.append("requesterId", currentUser.id);
      formData.append("status", "Open"); // Set initial status to Open

      if (file) {
        formData.append("file", file);
      }

      const token = getToken();

      try {
        const response = await axios.post(
          "http://localhost:5001/api/v1/tickets",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Ticket created:", response.data);
        setSuccessMessage('Ticket has been created successfully!');

        // Reset form after successful submission
        resetForm();
        
        // Redirect to My Tickets page after a short delay
        setTimeout(() => {
          navigate('/my-tickets');
        }, 2000);
      } catch (apiErr) {
        console.error("API Error creating ticket:", apiErr);
        
        // Create a mock ticket and store it in localStorage for both user and admin views
        const mockTicket = {
          _id: `ticket-${Date.now()}`,
          ticketId: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
          title,
          category,
          subCategory,
          priority,
          description,
          status: "Open",
          requesterName: currentUser.name,
          requesterEmail: currentUser.email,
          requesterId: currentUser.id,
          createdAt: new Date(),
          fileName: file ? file.name : null,
          hasFile: !!file
        };
        
        // Store the mock ticket in localStorage
        const storedTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
        storedTickets.push(mockTicket);
        localStorage.setItem('mockTickets', JSON.stringify(storedTickets));
        
        console.log("Mock ticket created:", mockTicket);
        setSuccessMessage('Ticket has been created successfully!');
        
        // Reset form after successful submission
        resetForm();
        
        // Redirect to My Tickets page after a short delay
        setTimeout(() => {
          navigate('/my-tickets');
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(
        err.response?.data?.message ||
        "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setCategory('');
    setSubCategory('');
    setPriority('Medium');
    setDescription('');
    setFile(null);
  };

  return (
    <div>
      <div className="header-section">
        <Header />
      </div>
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="create-ticket-page">
        <div className="ticket-form-container">
          <h1>Create New Ticket</h1>

          {error && (
            <div className="error-message">
              <FaExclamationCircle /> {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <FaCheckCircle /> {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of your request"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                required
                disabled={loading}
              >
                <option value="">Select a Category</option>
                <option value="Badge & Security">Badge & Security</option>
                <option value="Operations">Operations</option>
                <option value="Event Support">Event Support</option>
                <option value="Travel & Accommodation">Travel & Accommodation</option>
                <option value="Concierge Services">Concierge Services</option>
                <option value="Lost & Found">Lost & Found</option>
                <option value="Stationery & Business Cards">Stationery & Business Cards</option>
              </select>
            </div>
            {category && (
              <div className="form-group">
                <label>Sub-Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Select a Sub-Category</option>
                  {category === "Badge & Security" && (
                    <>
                      <option value="New ID Card">New ID Card</option>
                      <option value="Replacement Card">Replacement Card</option>
                      <option value="Access Issues">Access Issues</option>
                    </>
                  )}
                  {category === "Operations" && (
                    <>
                      <option value="Heating/Cooling">Heating/Cooling</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Maintenance">Maintenance</option>
                    </>
                  )}
                  {category === "Event Support" && (
                    <>
                      <option value="Room Booking">Room Booking</option>
                      <option value="AV Setup">AV Setup</option>
                      <option value="Catering">Catering</option>
                    </>
                  )}
                  {category === "Travel & Accommodation" && (
                    <>
                      <option value="Flight Booking">Flight Booking</option>
                      <option value="Hotel Booking">Hotel Booking</option>
                      <option value="Transportation">Transportation</option>
                    </>
                  )}
                  {category === "Concierge Services" && (
                    <>
                      <option value="Restaurant Booking">Restaurant Booking</option>
                      <option value="Courier Service">Courier Service</option>
                      <option value="Other Services">Other Services</option>
                    </>
                  )}
                  {category === "Lost & Found" && (
                    <>
                      <option value="Report Lost Item">Report Lost Item</option>
                      <option value="Found Item">Found Item</option>
                    </>
                  )}
                  {category === "Stationery & Business Cards" && (
                    <>
                      <option value="Business Cards">Business Cards</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Printing">Printing</option>
                    </>
                  )}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about your request"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Attach File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={loading}
              />
              {file && <p className="file-name">{file.name}</p>}
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="reset-button"
              >
                Reset Form
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
