import React, { useState, useEffect } from 'react';
import styles from './OnlineUsers.module.css';

function OnlineUsers({ socket }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Don't do anything if socket is null or undefined or doesn't have 'on' property
    if (!socket || !socket.on) return;

    const handleUserConnected = (username) => {
      setUsers((prevUsers) => [...prevUsers, username]);
    };

    const handleUserDisconnected = (username) => {
      setUsers((prevUsers) => prevUsers.filter(user => user !== username));
    };

    const handleOnlineUsersUpdate = (usernames) => {
      setUsers(usernames);
    };

    socket.on('user connected', handleUserConnected);
    console.log('user connected event received');
    
    socket.on('user disconnected', handleUserDisconnected);
    console.log('user disconnected event received');

    socket.on('online users', handleOnlineUsersUpdate);
    console.log('online users event received');

    return () => {
      socket.off('user connected', handleUserConnected);
      socket.off('user disconnected', handleUserDisconnected);
      socket.off('online users', handleOnlineUsersUpdate);
    };
  }, [socket]);

  return (
    <div className={styles.onlineUsers}>
      <h2>Online Users:</h2>
      {users.map((username, index) => (
        <p key={index}>{username}</p>
      ))}
    </div>
  );
}

export default OnlineUsers;
