const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
adminSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
