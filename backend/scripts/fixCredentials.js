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

// Add the correctPassword method to the schema
adminSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Admin = mongoose.model('Admin', adminSchema, 'admins');

// Create or update admin users with working credentials
const createUsers = async () => {
  try {
    console.log('Checking existing users...');
    const existingUsers = await Admin.find();
    console.log(`Found ${existingUsers.length} users in the database`);
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        username: 'admin',
        password: adminPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    
    console.log('Admin user created/updated successfully:', {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      role: admin.role
    });
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await Admin.findOneAndUpdate(
      { email: 'user@example.com' },
      {
        name: 'Regular User',
        email: 'user@example.com',
        username: 'user',
        password: userPassword,
        role: 'user'
      },
      { upsert: true, new: true }
    );
    
    console.log('Regular user created/updated successfully:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    });
    
    // Test login for admin
    const adminForTest = await Admin.findOne({ email: 'admin@example.com' }).select('+password');
    const adminLoginWorks = await adminForTest.correctPassword('admin123', adminForTest.password);
    console.log(`Admin login test: ${adminLoginWorks ? 'SUCCESS' : 'FAILED'}`);
    
    // Test login for user
    const userForTest = await Admin.findOne({ email: 'user@example.com' }).select('+password');
    const userLoginWorks = await userForTest.correctPassword('user123', userForTest.password);
    console.log(`User login test: ${userLoginWorks ? 'SUCCESS' : 'FAILED'}`);
    
    console.log('\nLogin Credentials:');
    console.log('Admin: email=admin@example.com, password=admin123');
    console.log('User: email=user@example.com, password=user123');
    
  } catch (err) {
    console.error('Error creating/updating users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
createUsers();
