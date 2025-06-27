const mongoose = require("mongoose");

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
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  description: String,
  fileData: Buffer, // Store the actual file content as binary data
  fileContentType: String, // Store the MIME type of the file
  fileName: String, // Store the original filename
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ticket", TicketSchema, "Tickets");
