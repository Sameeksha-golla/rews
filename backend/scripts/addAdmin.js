const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to MongoDB
const DB_URL = process.env.DATABASE || 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose.connect(DB_URL)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Admin to add
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists. Updating password...');
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('Admin password updated successfully!');
    } else {
      // Create new admin
      const admin = new Admin({
        email: 'admin@example.com',
        password: 'admin123',
        username: 'admin',
        name: 'Admin User',
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin created successfully!');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();
