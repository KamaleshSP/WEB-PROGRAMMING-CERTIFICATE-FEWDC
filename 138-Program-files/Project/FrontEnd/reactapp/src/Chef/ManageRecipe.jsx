import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiconfig';
import '../shared.css'; // Shared styles

const ManageRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData._id) {
      setUserId(userData._id);
    } else {
      handleLogout(); // No user data, force logout
    }
  }, []);

  const fetchRecipes = async () => {
    if (!userId) return;

    try {
      // Backend test expects a POST request with userId and category
      const response = await api.post('/recipe/user', { 
        userId: userId,
        category: categoryFilter 
      });
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
  }, [userId, categoryFilter]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAddRecipe = () => {
    localStorage.setItem('editId', ''); // Clear editId
    navigate('/chef/create');
  };

  
  const handleEdit = (id) => {
    localStorage.setItem('editId', id);
    navigate(`/chef/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipe/${id}`);
        fetchRecipes(); // Refresh list after delete
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Manage Recipes</h1>
        <div>
          <button onClick={handleAddRecipe} className="button button-add">Add Recipe</button>
          <button onClick={handleLogout} className="button button-logout">Logout</button>
        </div>
      </header>

      <div className="toolbar">
        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option value="All Categories">All Categories</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snacks">Snacks</option>
          <option value="Dessert">Dessert</option>
          {/* Add other categories as needed */}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Prep Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <tr key={recipe._id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.difficulty}</td>
                  <td>{recipe.prepTimeInMinutes} mins</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(recipe._id)} className="button button-edit">Edit</button>
                    <button onClick={() => handleDelete(recipe._id)} className="button button-delete">Delete</button>
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

export default ManageRecipe;