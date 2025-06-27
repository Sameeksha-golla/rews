const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if there are any admin users
    const admins = await Admin.find().select('+password');
    console.log(`Found ${admins.length} admin users in the database:`);
    
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`\nAdmin ${index + 1}:`);
        console.log(`- Email: ${admin.email}`);
        console.log(`- Username: ${admin.username}`);
        console.log(`- Password hash: ${admin.password ? admin.password.substring(0, 20) + '...' : 'No password'}`);
      });
    } else {
      console.log('No admin users found. Creating a default admin user...');
      
      // Create a default admin user
      const defaultAdmin = new Admin({
        email: 'admin@example.com',
        password: 'password123',
        username: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('Default admin user created successfully!');
    }
    
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
