const mongoose = require("mongoose");

// Comment schema for ticket comments
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  isAdminComment: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

const TicketSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: String,
  category: String,
  subCategory: String,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium",
  },
  description: String,
  fileData: Buffer, // Store the actual file content as binary data
  fileContentType: String, // Store the MIME type of the file
  fileName: String, // Store the original filename
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved", "Closed"],
    default: "Open"
  },
  requesterName: String,
  requesterEmail: String,
  assignedTo: String,
  adminNotes: String,
  comments: [CommentSchema],
  ticketId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Ticket", TicketSchema, "Tickets");
