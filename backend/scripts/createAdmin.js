const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  // Get credentials from command line arguments
  const email = process.argv[2];
  const username = process.argv[3];
  const password = process.argv[4];

  if (!email || !username || !password) {
    console.log('Usage: node scripts/createAdmin.js <email> <username> <password>');
    console.log('Example: node scripts/createAdmin.js newadmin@example.com newadmin MySecurePass123!');
    process.exit(1);
  }

  // Check if admin with this email already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log('Admin with this email already exists');
    process.exit(1);
  }

  // Create new admin
  const admin = new Admin({
    username,
    email,
    password, // This will be hashed by the pre-save middleware
  });

  try {
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nIMPORTANT: Change these credentials after first login!');
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }

  process.exit(0);
};

// Run the script
connectDB().then(() => {
  createAdmin();
});
