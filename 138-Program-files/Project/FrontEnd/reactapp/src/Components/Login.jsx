import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../apiconfig';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await api.post('/user/login', { email, password });
        
        // The test case expects a 200 for "Invalid Credentials"
        if (response.data.message === 'Invalid Credentials') {
          setApiError('Invalid email or password.');
        } else if (response.data.token) {
          // Successful login
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data.user));

          // Redirect based on role
          if (response.data.user.role === 'chef') {
            navigate('/chef/dashboard');
          } else {
            navigate('/foodie/dashboard');
          }
        }
      } catch (error) {
        setApiError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {apiError && <p className="error-message">{apiError}</p>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <button type="submit" className="login-button">Login</button>
        
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;