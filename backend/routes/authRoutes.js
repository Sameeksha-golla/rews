const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/login', authController.login);

// Protected admin routes
router.use(authController.protect);
router.get('/admins', adminController.getAllAdmins);

module.exports = router;
