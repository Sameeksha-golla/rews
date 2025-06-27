const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`.red.bold);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected'.green.bold);
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`.red.bold);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected'.yellow.bold);
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination'.yellow.bold);
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});

module.exports = connectDB;
