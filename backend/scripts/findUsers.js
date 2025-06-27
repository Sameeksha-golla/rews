const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// Connect to MongoDB
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Find all users
const findUsers = async () => {
  try {
    const users = await Admin.find().select('+password');
    console.log('Users found:', users);
  } catch (err) {
    console.error('Error finding users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
findUsers();
