import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const deleteMessage = async (id) => {
    console.log(`Deleting message with id: ${id}`); 
    try {
      await axios.delete(`https://elpasochat-c2d460370726.herokuapp.com/api/message/${id}`);
      setMessages(messages.filter(message => message._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const toggleBan = async (id, banned) => {
    try {
      const response = await axios.patch(`https://elpasochat-c2d460370726.herokuapp.com/api/users/${id}`, { banned });
      setUsers(users.map(user => user._id === id ? response.data.user : user));
    } catch (error) {
      console.error('Error banning/unbanning user:', error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://elpasochat-c2d460370726.herokuapp.com/api/message');
        setMessages(response.data?.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://elpasochat-c2d460370726.herokuapp.com/api/users');
        setUsers(response.data?.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const socket = io("https://elpasochat-c2d460370726.herokuapp.com");
  
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("user connected", (username) => {
      setUsers((users) => [...users, { username, online: true }]);
    });

    socket.on("user disconnected", (username) => {
      setUsers((users) =>
        users.map((user) =>
          user.username === username ? { ...user, online: false } : user
        )
      );
    });
  
    fetchMessages();
    fetchUsers();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Admin Panel</h1>

      <h2 className={styles.sectionTitle}>Messages</h2>
      {messages.map((message, index) => (
        <div key={index} className={styles.message}>
          <span>{message.username}</span>: {message.text}
          <button className={styles.deleteButton} onClick={() => deleteMessage(message._id)}>Delete</button>
        </div>
      ))}

      <h2 className={styles.sectionTitle}>Users</h2>
      {users.map((user, index) => (
        <div key={index} className={styles.user}>
          <span>{user.username}</span> {user.banned ? 'Banned' : 'Not banned'}
          <button className={user.banned ? styles.unbanButton : styles.banButton} onClick={() => toggleBan(user._id, !user.banned)}>
            {user.banned ? 'Unban' : 'Ban'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
