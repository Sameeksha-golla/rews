const Ticket = require('../models/Ticket');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get ticket statistics
// @route   GET /api/v1/tickets/stats
// @access  Admin
exports.getTicketStats = catchAsync(async (req, res, next) => {
  // Verify the user is an admin
  const user = req.user;
  if (user.role !== 'admin') {
    return next(new AppError('You do not have permission to access this resource', 403));
  }

  // Count tickets by status
  const stats = await Ticket.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format the results
  const result = {
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    total: 0
  };

  stats.forEach(stat => {
    const status = stat._id.toLowerCase();
    if (status === 'open') result.open = stat.count;
    else if (status === 'in progress') result.inProgress = stat.count;
    else if (status === 'resolved') result.resolved = stat.count;
    else if (status === 'closed') result.closed = stat.count;
  });

  // Calculate total
  result.total = result.open + result.inProgress + result.resolved + result.closed;

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// @desc    Get all admin users
// @route   GET /api/v1/auth/admins
// @access  Admin
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  // Verify the user is an admin
  const user = req.user;
  if (user.role !== 'admin') {
    return next(new AppError('You do not have permission to access this resource', 403));
  }

  const admins = await Admin.find({ role: 'admin' }).select('name email');

  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins
    }
  });
});

// @desc    Add comment to ticket
// @route   POST /api/v1/tickets/:id/comments
// @access  Private
exports.addTicketComment = catchAsync(async (req, res, next) => {
  const { content, isAdminComment } = req.body;
  
  if (!content) {
    return next(new AppError('Comment content is required', 400));
  }

  // Only admins can add admin comments
  if (isAdminComment && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to add admin comments', 403));
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  // Create comment object
  const comment = {
    content,
    isAdminComment: isAdminComment || false,
    createdAt: new Date(),
    createdBy: req.user._id
  };

  // Add comment to ticket
  ticket.comments = ticket.comments || [];
  ticket.comments.push(comment);
  await ticket.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment: ticket.comments[ticket.comments.length - 1]
    }
  });
});
