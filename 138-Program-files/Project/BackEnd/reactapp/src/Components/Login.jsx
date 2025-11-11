import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
 const navigate = useNavigate();

 const [formData, setFormData] = useState({
  email: '',
  password: '',
 });

 const [touched, setTouched] = useState({});
 const [errorMessage, setErrorMessage] = useState('');

// ✅ Handling input change
const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

// ✅ Mark field as touched
const handleBlur = (e) => {
setTouched({ ...touched, [e.target.name]: true });
};

// ✅ Validation logic
const validate = () => {
const errors = {};

if (!formData.email) {
errors.email = 'Email is required';
}

if (!formData.password) {
errors.password = 'Password is required';
}

return errors;
};

const errors = validate();

// ✅ Handle form submit
const handleSubmit = async (e) => {
e.preventDefault();

if (Object.keys(errors).length > 0) {
setTouched({ email: true, password: true });
return;
}

try {
const response = await axios.post('/user/login', formData);

if (response && response.data) {
const { token, user } = response.data;

localStorage.setItem('token', token);
localStorage.setItem('userData', JSON.stringify(user));

if (user.role === 'Chef') {
navigate('/manage-recipes');
} else if (user.role === 'Foodie') {
navigate('/recipe-catalog');
}
}
} catch (error) {
if (error.response && error.response.status === 401) {
setErrorMessage('Invalid email or password');
} else {
navigate('/error');
}
}
};

return (
<div className="login-container">
<div className="login-wrapper">
<div className="login-left">
<div className="login-box">
<h2>Login</h2>

<form onSubmit={handleSubmit} noValidate>
{/* Email Field */}
<div className="form-group">
<label>Email:</label>
<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
onBlur={handleBlur}
placeholder="Enter your email"
/>
{touched.email && errors.email && (
<span className="error">{errors.email}</span>
)}
</div>



{/* Password Field */}
<div className="form-group">
<label>Password:</label>
<input
type="password"
name="password"
value={formData.password}
onChange={handleChange}
onBlur={handleBlur}
placeholder="Enter your password"
/>
{touched.password && errors.password && (
<span className="error">{errors.password}</span>
)}
</div>

{/* Submit Button */}
<button type="submit" className="login-button">
Login
</button>

{/* API Error */}
{errorMessage && <p className="error">{errorMessage}</p>}

{/* Register Redirect */}
<p className="register-link">
Don't have an account? <Link to="/register">Register</Link>
</p>
</form>
</div>
</div>

<div className="login-right">
<h1>Cookistry</h1>
<p>Discover, share & cook delightful recipes</p>
</div>
</div>
</div>
);
};

export default Login;
