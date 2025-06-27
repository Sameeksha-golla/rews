const mongoose = require('mongoose');

// Connect to MongoDB using the connection string from the memories
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Print all collections in the database
const printCollections = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in the database:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
  } catch (err) {
    console.error('Error listing collections:', err);
  }
};

// Print all users in the admins collection
const printUsers = async () => {
  try {
    await printCollections();
    
    // Get all documents from the admins collection
    const users = await mongoose.connection.db.collection('admins').find({}).toArray();
    
    console.log('\nUsers found in admins collection:');
    users.forEach(user => {
      // Print user without the password
      const { password, ...userWithoutPassword } = user;
      console.log(JSON.stringify(userWithoutPassword, null, 2));
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('Has password:', !!user.password);
      console.log('---');
    });
    
    console.log(`\nTotal users found: ${users.length}`);
  } catch (err) {
    console.error('Error finding users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
printUsers();
