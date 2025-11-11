import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
 const navigate = useNavigate();

 const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Chef',
 });

 const [touched, setTouched] = useState({});
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);

 // ✅ Handle input changes
 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 // ✅ Handle blur for validation
 const handleBlur = (e) => {
  setTouched({ ...touched, [e.target.name]: true });
 };

 // ✅ Validation logic
 const validate = () => {
  const errors = {};

  if (!formData.firstName) errors.firstName = 'First Name is required';
  if (!formData.lastName) errors.lastName = 'Last Name is required';
  if (!formData.mobileNumber) errors.mobileNumber = 'Mobile Number is required';
  if (!formData.email) errors.email = 'Email is required';
  if (!formData.password) errors.password = 'Password is required';
  if (formData.password && formData.password.length < 6)
   errors.password = 'Password must be at least 6 characters';

  if (!formData.confirmPassword)
   errors.confirmPassword = 'Confirm Password is required';
  else if (formData.password !== formData.confirmPassword)
   errors.confirmPassword = 'Passwords do not match';

  return errors;
 };

 const errors = validate();

 // ✅ Submit handler
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (Object.keys(errors).length > 0) {
   setTouched({
    firstName: true,
    lastName: true,
    mobileNumber: true,
    email: true,
    password: true,
    confirmPassword: true,
   });
   return;
  }

  
  try {
   await axios.post('/user/signup', formData);

   // Show success popup OR redirect
   setShowSuccessPopup(true);

   setTimeout(() => {
    navigate('/login');
   }, 1000);
  } catch (error) {
   navigate('/error');
  }
 };

return (
<div className="login-container">
<div className="login-wrapper">
<div className="login-left">
<div className="login-box">
<h2>Register for Cookistry</h2>

<form onSubmit={handleSubmit} noValidate>
{/* First Name */}
<div className="form-group">
<label>First Name:</label>
<input
type="text"
name="firstName"
value={formData.firstName}
onChange={handleChange}
onBlur={handleBlur}
/>
{touched.firstName && errors.firstName && (
<span className="error">{errors.firstName}</span>
)}
</div>

{/* Last Name */}
<div className="form-group">
<label>Last Name:</label>
<input
type="text"
name="lastName"
value={formData.lastName}
onChange={handleChange}
onBlur={handleBlur}
/>
{touched.lastName && errors.lastName && (
<span className="error">{errors.lastName}</span>
)}
</div>


{/* Mobile Number */}
<div className="form-group">
<label>Mobile Number:</label>
<input
type="text"
name="mobileNumber"
value={formData.mobileNumber}
onChange={handleChange}
onBlur={handleBlur}
/>
{touched.mobileNumber && errors.mobileNumber && (
<span className="error">{errors.mobileNumber}</span>
)}
</div>

{/* Email */}
<div className="form-group">
<label>Email:</label>
<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
onBlur={handleBlur}
/>
{touched.email && errors.email && (
<span className="error">{errors.email}</span>
)}
</div>

{/* Password */}
<div className="form-group">
<label>Password:</label>
<input
type="password"
name="password"
value={formData.password}
onChange={handleChange}
onBlur={handleBlur}
/>
{touched.password && errors.password && (
<span className="error">{errors.password}</span>
)}
</div>

{/* Confirm Password */}
<div className="form-group">
<label>Confirm Password:</label>
<input
type="password"
name="confirmPassword"
value={formData.confirmPassword}
onChange={handleChange}
onBlur={handleBlur}
/>
{touched.confirmPassword && errors.confirmPassword && (
<span className="error">{errors.confirmPassword}</span>
)}
</div>

{/* Role Selection */}
<div className="form-group">
<label>Role:</label>
<select
name="role"
value={formData.role}
onChange={handleChange}
>
<option value="Chef">Chef</option>
<option value="Foodie">Foodie</option>
</select>
</div>

{/* Submit Button */}
<button type="submit" className="login-button">
Register
</button>

{/* Redirect to Login */}
<p className="register-link">
Already have an account? <Link to="/login">Login</Link>
</p>
</form>
</div>
</div>

<div className="login-right">
<h1>Cookistry</h1>
<p>Join our community of culinary creators</p>
</div>
</div>

{/* ✅ Success Message */}
{showSuccessPopup && (
<div className="modal">
<div className="modal-content">
<p>Registration Successful! Redirecting to login...</p>
</div>
</div>
)}
</div>
);
};

export default Register;
