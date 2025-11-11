import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiconfig';
import '../shared.css'; // Shared styles

const DisplayRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [sortOrder, setSortOrder] = useState(1); // 1 for ASC, -1 for DESC
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      // Backend test expects a POST request with sortOrder in the body
      const response = await api.post('/recipe/all', { sortOrder });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        handleLogout(); // Token failed, log out
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [sortOrder]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleSortChange = (e) => {
    setSortOrder(Number(e.target.value));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Recipe Catalog</h1>
        <button onClick={handleLogout} className="button button-logout">Logout</button>
      </header>

      <div className="toolbar">
        <select onChange={handleSortChange} value={sortOrder}>
          <option value={1}>Sort by Prep Time (ASC)</option>
          <option value={-1}>Sort by Prep Time (DESC)</option>
        </select>
      </div>

      <div className="table-container">
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
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <tr key={recipe._id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.difficulty}</td>
                  <td>{recipe.prepTimeInMinutes}</td>
                  <td>
                    {/* Placeholder for any future actions like 'View' */}
                    <button className="button button-view" disabled>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No recipes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayRecipes;