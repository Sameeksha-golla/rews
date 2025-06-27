const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if there are any tickets
    const tickets = await Ticket.find();
    console.log(`Found ${tickets.length} tickets in the database:`);
    console.log(JSON.stringify(tickets, null, 2));
    
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
