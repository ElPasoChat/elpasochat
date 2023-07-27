import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from '../components/ChatWindow.module.css';
import OnlineUsers from './OnlineUsers';
import NavBar from './NavBar';

function ChatWindow({ username }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = io('https://elpasochat-c2d460370726.herokuapp.com');
    socket.emit('login', username);

    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://elpasochat-c2d460370726.herokuapp.com/api/message');
        setMessages(response.data?.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('message-deleted', (messageId) => {
      setMessages((prevMessages) => prevMessages.filter(message => message._id !== messageId));
    });

    setSocket(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [username]);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`https://elpasochat-c2d460370726.herokuapp.com/api/message/${id}`);
      setMessages(messages.filter(message => message._id !== id));
    } catch (error) {
      console.error(`Error deleting message with id ${id}:`, error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      return;
    }

    const message = {
      text: newMessage.trim(),
      username,
    };

    console.log('Sending message:', message);

    socket.emit('send-message', message);
    setNewMessage('');
  };

  return (
    <div>
      <div className={styles.chatContainer}>
        <div className={styles.chatWindow}>
          <div className={styles.messages}>
          {messages?.map((message, index) => (
  <p key={message._id}>
    <span className={styles.chatUsername}>{message.username}</span>: {message.text}
    <span className={styles.deleteIcon} onClick={() => handleDeleteMessage(message._id)}>x</span>
  </p>
))}

            <div ref={messagesEndRef} />
          </div>
          <div className={styles.actionBar}>
            <button className={styles.clearButton} onClick={handleClearChat}>Clear Chat</button>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="text"
                placeholder="Enter message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className={styles.button} type="submit">Send</button>
            </form>
          </div>
        </div>
        {socket && <div className={styles.onlineUsers}><OnlineUsers socket={socket} /></div>}
      </div>
    </div>
  );
}

export default ChatWindow;
