const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB using the connection string from the memories
const DB = 'mongodb+srv://gollasameeksha:OlinSif9GKasPi66@cluster0.lwcm8gl.mongodb.net/sigma';

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Define Admin schema directly in this script
const adminSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

// Create Admin model
const Admin = mongoose.model('Admin', adminSchema, 'admins');

// Create new users with working credentials
const createUsers = async () => {
  try {
    // First, delete any existing users with these emails to avoid conflicts
    await Admin.deleteMany({ email: { $in: ['admin@example.com', 'user@example.com'] } });
    console.log('Deleted existing users with the same emails');
    
    // Create admin user with hashed password
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    });
    
    console.log('Admin user created successfully:', {
      name: admin.name,
      email: admin.email,
      username: admin.username,
      role: admin.role
    });
    
    // Create regular user with hashed password
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await Admin.create({
      name: 'Regular User',
      email: 'user@example.com',
      username: 'user',
      password: userPassword,
      role: 'user'
    });
    
    console.log('Regular user created successfully:', {
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    });
    
    console.log('\nLogin Credentials:');
    console.log('Admin: email=admin@example.com, password=admin123');
    console.log('User: email=user@example.com, password=user123');
    
  } catch (err) {
    console.error('Error creating users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
createUsers();
