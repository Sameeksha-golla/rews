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

// Create regular user
const createUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await Admin.findOne({ email: 'user@rews.com' });
    
    if (existingUser) {
      console.log('Regular user already exists!');
      return;
    }
    
    // Create new regular user
    const user = await Admin.create({
      name: 'Regular User',
      email: 'user@rews.com',
      username: 'user',
      password: 'user123456',
      role: 'user'
    });
    
    console.log('Regular user created successfully:', user);
  } catch (err) {
    console.error('Error creating regular user:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the function
createUser();
