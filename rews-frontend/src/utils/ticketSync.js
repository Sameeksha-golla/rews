/**
 * Ticket synchronization utility
 * This module provides functions to synchronize ticket data between admin and user views
 */

/**
 * Update a ticket in localStorage
 * @param {string} ticketId - ID of the ticket to update
 * @param {Object} updates - Object containing the updates to apply
 * @returns {boolean} - True if the ticket was found and updated, false otherwise
 */
export const updateTicketInStorage = (ticketId, updates) => {
  try {
    // Get all tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
    
    // Find the ticket to update
    const ticketIndex = storedTickets.findIndex(ticket => ticket._id === ticketId);
    
    if (ticketIndex === -1) {
      console.log(`Ticket ${ticketId} not found in localStorage`);
      return false;
    }
    
    // Update the ticket
    storedTickets[ticketIndex] = {
      ...storedTickets[ticketIndex],
      ...updates,
      lastUpdated: new Date()
    };
    
    // Save the updated tickets back to localStorage
    localStorage.setItem('mockTickets', JSON.stringify(storedTickets));
    console.log(`Ticket ${ticketId} updated in localStorage:`, updates);
    
    return true;
  } catch (error) {
    console.error('Error updating ticket in localStorage:', error);
    return false;
  }
};

/**
 * Add a comment to a ticket in localStorage
 * @param {string} ticketId - ID of the ticket to add a comment to
 * @param {Object} comment - Comment object to add
 * @returns {boolean} - True if the ticket was found and the comment was added, false otherwise
 */
export const addCommentToTicket = (ticketId, comment) => {
  try {
    // Get all tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
    
    // Find the ticket to update
    const ticketIndex = storedTickets.findIndex(ticket => ticket._id === ticketId);
    
    if (ticketIndex === -1) {
      console.log(`Ticket ${ticketId} not found in localStorage`);
      return false;
    }
    
    // Initialize comments array if it doesn't exist
    if (!storedTickets[ticketIndex].comments) {
      storedTickets[ticketIndex].comments = [];
    }
    
    // Add the comment
    storedTickets[ticketIndex].comments.push({
      ...comment,
      _id: `comment-${Date.now()}`,
      createdAt: new Date()
    });
    
    // Save the updated tickets back to localStorage
    localStorage.setItem('mockTickets', JSON.stringify(storedTickets));
    console.log(`Comment added to ticket ${ticketId} in localStorage:`, comment);
    
    return true;
  } catch (error) {
    console.error('Error adding comment to ticket in localStorage:', error);
    return false;
  }
};

/**
 * Get a ticket from localStorage by ID
 * @param {string} ticketId - ID of the ticket to get
 * @returns {Object|null} - The ticket object if found, null otherwise
 */
export const getTicketFromStorage = (ticketId) => {
  try {
    // Get all tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
    
    // Find the ticket
    const ticket = storedTickets.find(ticket => ticket._id === ticketId);
    
    return ticket || null;
  } catch (error) {
    console.error('Error getting ticket from localStorage:', error);
    return null;
  }
};

/**
 * Get all tickets from localStorage
 * @returns {Array} - Array of ticket objects
 */
export const getAllTicketsFromStorage = () => {
  try {
    // Get all tickets from localStorage
    return JSON.parse(localStorage.getItem('mockTickets') || '[]');
  } catch (error) {
    console.error('Error getting tickets from localStorage:', error);
    return [];
  }
};
