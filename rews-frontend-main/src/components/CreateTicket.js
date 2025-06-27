import React, { useState } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import '../styles/CreateTicket.css';

const TicketForm = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ title, category, subCategory, priority, description, file });
        setSuccessMessage('Ticket has been created successfully!'); // Set success message
        resetForm(); // Optional: Reset form after submission
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setSubCategory(''); // Reset subcategory when category changes
    };

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
                <Header/>
            </div>
            <div className="navbar-section">
                <Navbar/>
            </div>
            <div className="create-ticket-page">
                <div className="ticket-form-container">
                    <h1>Create New Ticket</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Brief description of your request" 
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={category} onChange={handleCategoryChange} required>
                                <option value="">Select a Category</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Bug Report">Bug Report</option>
                                <option value="General Inquiry">General Inquiry</option>
                            </select>
                        </div>
                        {category && (
                            <div className="form-group">
                                <label>Sub-Category</label>
                                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
                                    <option value="">Select a Sub-Category</option>
                                    {category === "Feature Request" && (
                                        <>
                                            <option value="UI Improvement">UI Improvement</option>
                                            <option value="Functionality Addition">Functionality Addition</option>
                                        </>
                                    )}
                                    {category === "Bug Report" && (
                                        <>
                                            <option value="Minor Bug">Minor Bug</option>
                                            <option value="Major Bug">Major Bug</option>
                                        </>
                                    )}
                                    {category === "General Inquiry" && (
                                        <>
                                            <option value="Product Info">Product Info</option>
                                            <option value="Pricing Query">Pricing Query</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
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
                            />
                        </div>
                        <div className="form-group">
                            <label>Attach Image</label>
                            <input 
                                type="file" 
                                onChange={(e) => setFile(e.target.files[0])} 
                                accept="image/*"
                            />
                        </div>
                        <button type="submit" className="submit-button">Create Ticket</button>
                    </form>
                    {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message display */}
                </div>
            </div>
        </div>
    );
};

export default TicketForm;
