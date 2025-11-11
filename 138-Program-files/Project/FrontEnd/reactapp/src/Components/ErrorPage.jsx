import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Something Went Wrong</h1>
        <p>We're sorry, but an error occurred. Please try again later.</p>
        <Link to="/login" className="home-button">Go to Login</Link>
      </div>
    </div>
  );
};

export default ErrorPage;