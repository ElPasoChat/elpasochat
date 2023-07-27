const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Only required for admin users
  },
  role: {
    type: String,
    default: 'user', // Default role is 'user'
  },
});

UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new) and role is admin
  if (this.isModified('password') && this.role === 'admin') {
    console.log(`Hashing password for admin: ${this.username}`);
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
