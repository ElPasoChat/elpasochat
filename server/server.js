const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Import the User and Message models
const { User } = require('./models/user');
const { Message } = require('./models/message');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

const server = http.createServer(app);

const io = socketIO(server, {
  cors: corsOptions,
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('send-message', async (message) => {
    console.log('Received message:', message);

    // Create a new Message document
    const newMessage = new Message(message);
    await newMessage.save();

    // Emit the received message back to all connected clients
    io.emit('message', newMessage);
  });

  socket.on('login', async (username) => {
    onlineUsers.set(socket.id, username);
    console.log(`User connected: ${username}`);
    io.emit('user connected', username);
    io.emit('online users', Array.from(onlineUsers.values()));
  });

  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    console.log(`User disconnected: ${username}`);
    io.emit('user disconnected', username);
    io.emit('online users', Array.from(onlineUsers.values()));
  });
});

// Route to get all messages
app.get('/api/message', async (req, res) => {
  const messages = await Message.find({});
  res.json({ messages });
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.json({ users });
});

// Route to delete a message
app.delete('/api/message/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting message with id: ${id}`);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ObjectID' });
  }
  const message = await Message.findByIdAndRemove(id);
  if (!message) {
    return res.status(404).json({ error: 'No message found with this id' });
  }

  // Emit the message deleted event
  io.emit('message-deleted', id);

  res.json({ message: 'Message deleted successfully' });
});



// Route to ban/unban a user
app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { banned } = req.body;
  const user = await User.findByIdAndUpdate(id, { banned }, { new: true });
  res.json({ user });
});

app.post('/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new admin user
    const newAdmin = new User({
      username,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    });

    // Save the new admin user to the database
    await newAdmin.save();

    return res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the admin user in the database by username
    const adminUser = await User.findOne({ username });

    // If admin user is not found or password doesn't match, return an error
    if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Admin login successful
    return res.status(200).json({ message: 'Admin login successful' });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
