const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

// MongoDB Atlas connection string (directly from project info)
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('MongoDB connected for adding test users'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Test user data
const testUsers = [
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    username: 'regularuser',
    role: 'user'
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'password123',
    username: 'johnsmith',
    role: 'user'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    username: 'sarahjohnson',
    role: 'user'
  }
];

// Function to add/update test users
const addTestUsers = async () => {
  try {
    const promises = testUsers.map(async (userData) => {
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`Updating existing user: ${userData.email}`);
        
        // Update user with new data (except password)
        existingUser.name = userData.name;
        existingUser.username = userData.username;
        existingUser.role = userData.role;
        
        // Only update password if needed
        if (userData.password) {
          existingUser.password = userData.password;
        }
        
        await existingUser.save();
        return existingUser;
      } else {
        console.log(`Creating new user: ${userData.email}`);
        
        // Create new user
        return await User.create(userData);
      }
    });
    
    await Promise.all(promises);
    console.log('Test users added or updated successfully!');
    
    // Retrieve and show all users (without passwords)
    const allUsers = await User.find({}, { password: 0 });
    console.log('Current users in database:');
    console.table(allUsers.map(user => ({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    })));
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error adding test users:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

addTestUsers();
