const Ticket = require("../models/Ticket");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const path = require("path");
const fs = require("fs");

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private
exports.getAllTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find();

  res.status(200).json({
    status: "success",
    results: tickets.length,
    data: {
      tickets,
    },
  });
});

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError("No ticket found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      ticket,
    },
  });
});

// @desc    Create new ticket
// @route   POST /api/v1/tickets
// @access  Private
exports.createTicket = catchAsync(async (req, res, next) => {
  try {
    // Generate a unique ID for the ticket
    const ticketId = `TICKET-${Date.now()}`;

    // Create the ticket with the generated ID
    const ticketData = {
      _id: ticketId,
      title: req.body.title,
      category: req.body.category,
      subCategory: req.body.subCategory,
      priority: req.body.priority || "Medium",
      description: req.body.description,
    };

    // Handle file upload if present
    if (req.file) {
      // Store file content directly in the database
      ticketData.fileData = req.file.buffer;
      ticketData.fileContentType = req.file.mimetype;
      ticketData.fileName = req.file.originalname;
    }

    const newTicket = await Ticket.create(ticketData);

    // Remove the binary file data from the response
    const ticketResponse = newTicket.toObject();
    if (ticketResponse.fileData) {
      delete ticketResponse.fileData;
      ticketResponse.hasFile = true;
    }

    res.status(201).json({
      status: "success",
      data: {
        ticket: ticketResponse,
      },
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return next(new AppError("Failed to create ticket", 400));
  }
});

// @desc    Update ticket
// @route   PATCH /api/v1/tickets/:id
// @access  Private
exports.updateTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    return next(new AppError("No ticket found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      ticket,
    },
  });
});

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private
exports.deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    return next(new AppError("No ticket found with that ID", 404));
  }

  // Delete associated file if it exists
  if (ticket.filePath) {
    const filePath = path.join(__dirname, "../uploads", ticket.filePath);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      // Continue with ticket deletion even if file deletion fails
    }
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// @desc    Serve ticket file
// @route   GET /api/v1/tickets/files/:ticketId
// @access  Private
exports.getTicketFile = catchAsync(async (req, res, next) => {
  // Check for token in query parameters (for direct browser access)
  if (req.query.token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  const ticketId = req.params.ticketId;

  // Find the ticket with the given ID
  const ticket = await Ticket.findById(ticketId);

  // Check if ticket exists and has a file
  if (!ticket || !ticket.fileData) {
    return next(new AppError("File not found", 404));
  }

  // Set the content type header
  res.set("Content-Type", ticket.fileContentType);
  
  // For images, PDFs and other viewable files, display them inline in the browser
  // For other file types, suggest downloading them
  const viewableTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'text/plain', 'text/html',
    'video/mp4'
  ];
  
  const disposition = viewableTypes.includes(ticket.fileContentType) 
    ? 'inline' 
    : 'attachment';
  
  res.set("Content-Disposition", `${disposition}; filename="${ticket.fileName}"`);
  
  // Send the file data from the database
  res.send(ticket.fileData);
});
