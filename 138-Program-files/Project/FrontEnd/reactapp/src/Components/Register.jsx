import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../apiconfig';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    role: 'user', // Default role
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Exclude confirmPassword from the data sent to the API
        const { confirmPassword, ...apiData } = formData;
        
        await api.post('/user/register', apiData);
        navigate('/login'); // Redirect to login on success
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrors(prev => ({ ...prev, api: error.response.data.message }));
        } else {
          setErrors(prev => ({ ...prev, api: 'Registration failed. Please try again.' }));
        }
      }
    }
  };

  
  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register for Cookistry</h2>
        {errors.api && <p className="error-message">{errors.api}</p>}
        
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
        
        <div className="form-group">
          <label>Mobile Number</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
          {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">Foodie (User)</option>
            <option value="chef">Chef</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>
        
        <button type="submit" className="register-button">Register</button>
        
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;