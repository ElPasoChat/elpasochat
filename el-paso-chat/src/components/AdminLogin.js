// AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/admin/login', formData);

      localStorage.setItem('adminToken', response.data.token);

      // Use navigate('/admin/panel') instead of history.push('/admin/panel')
      navigate('/admin/panel');
    } catch (error) {
      console.error('Error during admin login:', error);
      setErrorMessage('Invalid username or password');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.adminLoginContainer}>
      <h2>Admin Login</h2>
      <form className={styles.adminLoginForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
