const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB using the connection string from the memories
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Define a simple Admin schema for this script
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  name: String,
  role: String
});

const Admin = mongoose.model('Admin', adminSchema, 'admins');

// Update credentials
const updateCredentials = async () => {
  try {
    // Create or update admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await Admin.updateOne(
      { email: 'admin@example.com' },
      {
        $set: {
          name: 'Admin User',
          password: adminPassword,
          username: 'admin',
          role: 'admin'
        }
      },
      { upsert: true }
    );
    
    console.log('Admin credentials updated successfully');
    
    // Create or update regular user
    const userPassword = await bcrypt.hash('user123', 12);
    await Admin.updateOne(
      { email: 'user@example.com' },
      {
        $set: {
          name: 'Regular User',
          password: userPassword,
          username: 'user',
          role: 'user'
        }
      },
      { upsert: true }
    );
    
    console.log('User credentials updated successfully');
    
    console.log('\nNew Login Credentials:');
    console.log('Admin: email=admin@example.com, password=admin123');
    console.log('User: email=user@example.com, password=user123');
    
  } catch (err) {
    console.error('Error updating credentials:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
updateCredentials();
