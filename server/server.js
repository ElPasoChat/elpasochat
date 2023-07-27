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
  origin: 'https://elpasochat.vercel.app/',
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

// other routes remain the same

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
