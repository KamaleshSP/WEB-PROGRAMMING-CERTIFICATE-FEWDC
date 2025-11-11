import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
 return (
  <div className="error-parent">
   <div className="error-container">
    <h1 className="htage">Something Went Wrong</h1>
    <p className="ptag">
     We're sorry, but an error occurred. Please try again later.
    </p>
   </div>
  </div>
 );
};

export default ErrorPage;

