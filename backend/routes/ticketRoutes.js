const express = require("express");
const ticketController = require("../controllers/ticketController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const upload = require("../utils/fileUpload");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Admin routes for ticket statistics
router.get('/stats', adminController.getTicketStats);

// Routes for tickets
router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(upload.single("file"), ticketController.createTicket);

// Route to serve files from the database
// This route needs special handling for authentication via query params
router.get('/files/:ticketId', authController.protect, ticketController.getTicketFile);

// Route for ticket comments
router.post('/:id/comments', adminController.addTicketComment);

router
  .route("/:id")
  .get(ticketController.getTicket)
  .patch(upload.single('file'), ticketController.updateTicket)
  .delete(ticketController.deleteTicket);

module.exports = router;
