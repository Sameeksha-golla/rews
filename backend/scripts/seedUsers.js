const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to MongoDB
const DB_URL = process.env.DATABASE || 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose.connect(DB_URL)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Users to seed
const users = [
  {
    email: 'user@example.com',
    password: 'user12345',
    name: 'Regular User',
    username: 'regularuser',
    role: 'user'
  },
  {
    email: 'john.smith@example.com',
    password: 'john12345',
    name: 'John Smith',
    username: 'johnsmith',
    role: 'user'
  },
  {
    email: 'sarah.johnson@example.com',
    password: 'sarah12345',
    name: 'Sarah Johnson',
    username: 'sarahjohnson',
    role: 'user'
  },
  {
    email: 'admin@example.com',
    password: 'admin12345',
    name: 'Admin User',
    username: 'adminuser',
    role: 'admin'
  }
];

// Function to seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    await Admin.deleteMany({});
    
    console.log('Deleted existing users and admins');
    
    // Create new users
    for (const userData of users) {
      if (userData.role === 'admin') {
        await Admin.create(userData);
        console.log(`Created admin: ${userData.name}`);
      } else {
        await User.create(userData);
        console.log(`Created user: ${userData.name}`);
      }
    }
    
    console.log('All users created successfully');
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedUsers();
