const bcrypt = require('bcrypt');
const { User } = require('../models/user');

// Controller function for admin registration
async function registerAdmin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    const user = new User({ username, password, role: 1 }); // Role 1 signifies admin

    await user.save();
    res.json({ message: 'Admin registered successfully' });

  } catch (error) {
    console.error('Error', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { registerAdmin };
