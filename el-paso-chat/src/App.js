import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatWindow from './components/ChatWindow';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import NavBar from './components/NavBar';
import styles from './App.module.css';
import AdminRegistrationForm from './components/AdminRegistrationForm';

function Home() {
  const [username, setUsername] = useState('');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setUsername(e.target.elements.username.value);
  };

  return username ? (
    <ChatWindow username={username} />
  ) : (
    <form className={styles.form} onSubmit={handleUsernameSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Enter your username"
        name="username"
      />
      <button className={styles.button} type="submit">Enter</button>
    </form>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/admin/register" element={<AdminRegistrationForm />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
