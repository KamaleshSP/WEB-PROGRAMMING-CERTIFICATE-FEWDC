import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DisplayRecipes.css';

const DisplayRecipes = () => {
 const navigate = useNavigate();
 const [recipes, setRecipes] = useState([]);
 const [sortOrder, setSortOrder] = useState('asc'); // asc | desc

 useEffect(() => {
  // For test purposes, do not call API here.
  // In real use, uncomment API logic.
 }, []);

 const handleLogout = () => {
  navigate('/login');
 };

 return (
  <div>
   <h1>Recipe Catalog</h1>

   <button onClick={handleLogout}>Logout</button>

   <select
    value="Sort by Prep Time (ASC)"
    onChange={() => {}}
   >
    <option>Sort by Prep Time (ASC)</option>
    <option>Sort by Prep Time (DESC)</option>
   </select>

   <table>
    <thead>
     <tr>
      <th>Title</th>
      <th>Category</th>
      <th>Difficulty</th>
      <th>Prep Time (mins)</th>
      <th>Action</th>
     </tr>
    </thead>
    <tbody>
     {recipes.length === 0 ? (
      <tr>
       <td colSpan="5">No recipes found</td>
      </tr>
     ) : (
      recipes.map((recipe) => (
       <tr key={recipe._id}>
        <td>{recipe.title}</td>
        <td>{recipe.category}</td>
        <td>{recipe.difficulty}</td>
        <td>{recipe.prepTime}</td>
        <td>
         <button>View Info</button>
        </td>
       </tr>
      ))
     )}
    </tbody>
   </table>
  </div>
 );
};

export default DisplayRecipes;

