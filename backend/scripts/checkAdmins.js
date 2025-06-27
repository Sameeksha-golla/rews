const mongoose = require('mongoose');
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

const checkAdmins = async () => {
  try {
    await connectDB();
    
    // Find all admin users
    const admins = await Admin.find({}).select('email username');
    
    if (admins.length === 0) {
      console.log('No admin users found in the database.');
    } else {
      console.log(`Found ${admins.length} admin users:`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}, Username: ${admin.username}`);
      });
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error checking admin users:', err.message);
    process.exit(1);
  }
};

checkAdmins();
