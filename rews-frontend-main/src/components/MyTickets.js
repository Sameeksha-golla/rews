import React, { useState } from 'react';
import '../styles/MyTickets.css';
import Header from './Header';
import Navbar from './Navbar';

const MyTickets = () => {
    const [ticketIdSearch, setTicketIdSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    // Comprehensive sample tickets data with realistic details
    const [tickets, setTickets] = useState([
            {
            id: 'TKT001',
            title: 'Access card not working at main entrance',
            category: 'BADGE & SECURITY',
            status: 'NEW',
            createdDate: '2023-12-15',
            createdTime: '09:30 AM',
            attachment: 'access_card_photo.jpg'
        },
        {
            id: 'TKT002',
            title: 'Conference room AC not cooling properly',
            category: 'OPERATIONS',
            status: 'IN PROGRESS',
            createdDate: '2023-12-14',
            createdTime: '02:15 PM',
            attachment: null
        },
        {
            id: 'TKT003',
            title: 'Setup required for board meeting on 25th Dec',
            category: 'EVENT SUPPORT',
            status: 'ONHOLD',
            createdDate: '2023-12-13',
            createdTime: '11:45 AM',
            attachment: 'meeting_requirements.pdf'
        },
        {
            id: 'TKT004',
            title: 'Hotel booking for client visit to Mumbai',
            category: 'TRAVEL & ACCOMMODATION',
            status: 'CLOSED',
            createdDate: '2023-12-12',
            createdTime: '04:20 PM',
            attachment: 'travel_itinerary.pdf'
        },
        {
            id: 'TKT005',
            title: 'Business cards needed for new employee',
            category: 'STATIONERY & BUSINESS CARDS',
            status: 'NEW',
            createdDate: '2023-12-11',
            createdTime: '10:15 AM',
            attachment: 'employee_details.docx'
        },
        {
            id: 'TKT006',
            title: 'Lost employee ID card - replacement needed',
            category: 'BADGE & SECURITY',
            status: 'IN PROGRESS',
            createdDate: '2023-12-10',
            createdTime: '03:45 PM',
            attachment: 'id_proof.jpg'
        },
        {
            id: 'TKT007',
            title: 'Printer maintenance in 3rd floor',
            category: 'OPERATIONS',
            status: 'CLOSED',
            createdDate: '2023-12-09',
            createdTime: '08:30 AM',
            attachment: null
        },
        {
            id: 'TKT008',
            title: 'Catering arrangement for team lunch',
            category: 'CONCIERGE SERVICES',
            status: 'NEW',
            createdDate: '2023-12-08',
            createdTime: '01:20 PM',
            attachment: 'menu_preferences.xlsx'
        },
        {
            id: 'TKT009',
            title: 'Flight booking for training program in Bangalore',
            category: 'TRAVEL & ACCOMMODATION',
            status: 'IN PROGRESS',
            createdDate: '2023-11-25',
            createdTime: '05:10 PM',
            attachment: 'training_schedule.pdf'
        },
        {
            id: 'TKT010',
            title: 'Audio visual setup for client presentation',
            category: 'EVENT SUPPORT',
            status: 'CLOSED',
            createdDate: '2023-11-20',
            createdTime: '09:00 AM',
            attachment: 'presentation_slides.pptx'
        },
        {
            id: 'TKT011',
            title: 'Office supplies order - pens and notebooks',
            category: 'STATIONERY & BUSINESS CARDS',
            status: 'ONHOLD',
            createdDate: '2023-11-15',
            createdTime: '12:30 PM',
            attachment: 'supply_list.xlsx'
        },
        {
            id: 'TKT012',
            title: 'Visitor pass system not functioning',
            category: 'BADGE & SECURITY',
            status: 'NEW',
            createdDate: '2023-11-10',
            createdTime: '07:45 AM',
            attachment: 'error_screenshot.png'
        },
        {
            id: 'TKT013',
            title: 'Car rental for client pickup from airport',
            category: 'CONCIERGE SERVICES',
            status: 'CLOSED',
            createdDate: '2023-10-28',
            createdTime: '06:15 PM',
            attachment: 'flight_details.pdf'
        },
        {
            id: 'TKT014',
            title: 'Cleaning service for executive boardroom',
            category: 'OPERATIONS',
            status: 'IN PROGRESS',
            createdDate: '2023-10-15',
            createdTime: '11:20 AM',
            attachment: null
        },
        {
            id: 'TKT015',
            title: 'Team building event organization',
            category: 'EVENT SUPPORT',
            status: 'ONHOLD',
            createdDate: '2023-10-05',
            createdTime: '02:50 PM',
            attachment: 'event_proposal.docx'
        },
        {
            id: 'TKT016',
            title: 'Letterhead printing for legal department',
            category: 'STATIONERY & BUSINESS CARDS',
            status: 'CLOSED',
            createdDate: '2023-09-20',
            createdTime: '04:30 PM',
            attachment: 'letterhead_design.ai'
        },
        {
            id: 'TKT017',
            title: 'Hotel accommodation for overseas client',
            category: 'TRAVEL & ACCOMMODATION',
            status: 'NEW',
            createdDate: '2023-08-15',
            createdTime: '10:45 AM',
            attachment: 'client_preferences.txt'
        },
        {
            id: 'TKT018',
            title: 'Security camera installation in parking area',
            category: 'BADGE & SECURITY',
            status: 'CLOSED',
            createdDate: '2023-08-01',
            createdTime: '01:15 PM',
            attachment: 'site_layout.dwg'
        }
    ]);

    const categories = [
        'BADGE & SECURITY',
        'OPERATIONS', 
        'EVENT SUPPORT',
        'TRAVEL & ACCOMMODATION',
        'CONCIERGE SERVICES',
        'STATIONERY & BUSINESS CARDS'
    ];

    const statuses = ['NEW', 'IN PROGRESS', 'ONHOLD', 'CLOSED'];

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleStatusChange = (status) => {
        setSelectedStatuses(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const clearAllFilters = () => {
        setTicketIdSearch('');
        setSelectedCategories([]);
        setSelectedStatuses([]);
        setDateRange('Last 30 Days');
        setCategoryDropdownOpen(false);
        setStatusDropdownOpen(false);
    };

    const toggleCategoryDropdown = () => {
        setCategoryDropdownOpen(!categoryDropdownOpen);
        setStatusDropdownOpen(false);
    };

    const toggleStatusDropdown = () => {
        setStatusDropdownOpen(!statusDropdownOpen);
        setCategoryDropdownOpen(false);
    };

    // Function to check if a date falls within the selected range
    const isWithinDateRange = (createdDate, range) => {
        const ticketDate = new Date(createdDate);
        const currentDate = new Date();
        const daysDifference = Math.floor((currentDate - ticketDate) / (1000 * 60 * 60 * 24));

        switch (range) {
            case 'Last 30 Days':
                return daysDifference <= 30;
            case 'Last 60 Days':
                return daysDifference <= 60;
            case 'Last 90 Days':
                return daysDifference <= 90;
            case 'All':
                return true;
            default:
                return true;
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesTicketId = ticketIdSearch === '' || 
                               ticket.id.toLowerCase().includes(ticketIdSearch.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(ticket.category);
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(ticket.status);
        const matchesDateRange = isWithinDateRange(ticket.createdDate, dateRange);
        
        return matchesTicketId && matchesCategory && matchesStatus && matchesDateRange;
    });

    return (
        <div>
            <div className="header-section">
            <Header/>
            </div>
            <div className="navbar-section">
                <Navbar/>
            </div>
            <div className="my-tickets-page">
                <div className="tickets-layout">
                    {/* Sidebar with filters */}
                    <div className="filters-sidebar">
                        <div className="filters-content">
                            <div className="filters-header">
                                <h3>Filters</h3>
                                <button className="clear-all-right" onClick={clearAllFilters}>Clear All</button>
                            </div>

                            {/* Category dropdown filter */}
                            <div className="filter-section">
                                <div className="filter-dropdown">
                                    <button 
                                        className="dropdown-header"
                                        onClick={toggleCategoryDropdown}
                                    >
                                        <span>Category</span>
                                        <span className={`dropdown-arrow ${categoryDropdownOpen ? 'open' : ''}`}>▼</span>
                                    </button>
                                    {categoryDropdownOpen && (
                                        <div className="dropdown-content category-dropdown">
                                            {categories.map(category => (
                                                <label key={category} className="checkbox-item">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => handleCategoryChange(category)}
                                                    />
                                                    <span className="checkbox-text">{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status dropdown filter */}
                            <div className="filter-section">
                                <div className="filter-dropdown">
                                    <button 
                                        className="dropdown-header"
                                        onClick={toggleStatusDropdown}
                                    >
                                        <span>Status</span>
                                        <span className={`dropdown-arrow ${statusDropdownOpen ? 'open' : ''}`}>▼</span>
                                    </button>
                                    {statusDropdownOpen && (
                                        <div className="dropdown-content">
                                            {statuses.map(status => (
                                                <label key={status} className="checkbox-item">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedStatuses.includes(status)}
                                                        onChange={() => handleStatusChange(status)}
                                                    />
                                                    <span className="checkbox-text">{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content area with table */}
                    <div className="tickets-content">
                        <div className="tickets-header">
                            <h2>Tickets</h2>
                            <div className="header-controls">
                                {/* Ticket ID Search */}
                                <input 
                                    type="text" 
                                    placeholder="Search Ticket ID" 
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

                        {/* Tickets table */}
                        <div className="tickets-table-wrapper">
                            {filteredTickets.length === 0 ? (
                <div className="no-tickets">
                                    <p>No tickets found matching your criteria.</p>
                </div>
            ) : (
                <table className="tickets-table">
                    <thead>
                        <tr>
                                                                                        <th>Ticket ID</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Created Date</th>
                                            <th>Created Time</th>
                                            <th>Attachment</th>
                        </tr>
                    </thead>
                    <tbody>
                                        {filteredTickets.map(ticket => (
                                            <tr key={ticket.id}>
                                                <td className="ticket-id">{ticket.id}</td>
                                                <td className="ticket-title">{ticket.title}</td>
                                                <td className="ticket-category">{ticket.category}</td>
                                                <td>
                                                    <span className={`status-badge ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="ticket-date">{ticket.createdDate}</td>
                                                <td className="ticket-time">{ticket.createdTime}</td>
                                                <td className="ticket-attachment">
                                                    {ticket.attachment ? (
                                                        <div className="attachment-item">
                                                            <span className="attachment-icon">📎</span>
                                                            <span className="attachment-name">{ticket.attachment}</span>
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
