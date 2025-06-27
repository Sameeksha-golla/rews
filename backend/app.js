const dotenv = require('dotenv');

// Load environment variables from .env file first
dotenv.config({ path: './.env' });

// Then import other modules that might use these variables
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const app = require('./server');

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...'.red.bold);
  console.error('Error:', err);
  
  // Close server & exit process
  server.close(() => {
    console.log('Process terminated!'.red.bold);
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red.bold);
  console.error('Error:', err);
  
  // Close server & exit process
  server.close(() => {
    console.log('Process terminated!'.red.bold);
    process.exit(1);
  });
});

// Handle SIGTERM for Heroku
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully'.red.bold);
  server.close(() => {
    console.log('💥 Process terminated!'.red.bold);
  });
});
