// AdminRegistrationForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminRegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your server to register the admin
      const response = await axios.post('http://localhost:3001/admin/register', formData);

      // Handle success or show a success message to the user
      console.log('Admin registration successful:', response.data);

      // Clear the form data after successful registration (optional)
      setFormData({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error during admin registration:', error);
      // Handle registration error (display error message, etc.)
    }
  };

  return (
    <div>
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AdminRegistrationForm;
