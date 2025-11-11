import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import ErrorPage from './Components/ErrorPage';
import DisplayRecipes from './Foodie/DisplayRecipes';
import ManageRecipe from './Chef/ManageRecipe';
import CreateRecipe from './Chef/CreateRecipe';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Foodie Routes */}
        <Route path="/foodie/dashboard" element={<DisplayRecipes />} />
        
        {/* Chef Routes */}
        <Route path="/chef/dashboard" element={<ManageRecipe />} />
        <Route path="/chef/create" element={<CreateRecipe />} />
        <Route path="/chef/edit/:id" element={<CreateRecipe />} /> {/* Edit route uses same component */}
        
        {/* Error Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;