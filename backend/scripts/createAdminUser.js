const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
// Using the MongoDB Atlas connection string directly from the memories
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@rews.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Create new admin user
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@rews.com',
      username: 'admin',
      password: 'admin123456',
      role: 'admin'
    });
    
    console.log('Admin user created successfully:', admin);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the function
createAdmin();
