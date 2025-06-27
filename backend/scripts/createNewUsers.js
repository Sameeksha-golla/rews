const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Connect to MongoDB
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Create new admin and user
const createUsers = async () => {
  try {
    // Create admin user directly with bcrypt for password hashing
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.findOneAndUpdate(
      { email: 'admin@rews.com' },
      {
        name: 'Admin User',
        email: 'admin@rews.com',
        username: 'admin',
        password: adminPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    
    console.log('Admin user created/updated successfully:', {
      name: admin.name,
      email: admin.email,
      username: admin.username,
      role: admin.role
    });
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await Admin.findOneAndUpdate(
      { email: 'user@rews.com' },
      {
        name: 'Regular User',
        email: 'user@rews.com',
        username: 'user',
        password: userPassword,
        role: 'user'
      },
      { upsert: true, new: true }
    );
    
    console.log('Regular user created/updated successfully:', {
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    });
    
    console.log('\nLogin Credentials:');
    console.log('Admin: email=admin@rews.com, password=admin123');
    console.log('User: email=user@rews.com, password=user123');
    
  } catch (err) {
    console.error('Error creating users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
createUsers();
