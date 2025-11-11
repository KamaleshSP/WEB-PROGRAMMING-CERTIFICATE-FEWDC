import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apiconfig';
import './CreateRecipe.css';

const initialState = {
  title: '',
  category: '',
  difficulty: '',
  prepTimeInMinutes: 0,
  cookTimeInMinutes: 0,
  servings: 0,
  cuisine: '',
  ingredients: '', // Stored as comma-separated string in form
  instructions: '', // Stored as comma-separated string in form
  tags: '', // Stored as comma-separated string in form
  notes: ''
};

const CreateRecipe = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editId, setEditId] = useState(null);
  
  const navigate = useNavigate();
  const params = useParams(); // For edit route /chef/edit/:id

  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData._id) {
      setUserId(userData._id);
    } else {
      navigate('/login'); // No user, redirect
    }

    const idFromStorage = localStorage.getItem('editId');
    const idFromParams = params.id;
    const effectiveId = idFromParams || idFromStorage;

    if (effectiveId) {
      setIsEditMode(true);
      setEditId(effectiveId);
      api.get(`/recipe/${effectiveId}`)
        .then(response => {
          const recipe = response.data;
          // Convert arrays back to comma-separated strings for form fields
          setFormData({
            ...recipe,
            ingredients: recipe.ingredients.join(','),
            instructions: recipe.instructions.join(','),
            tags: recipe.tags ? recipe.tags.join(',') : ''
          });
        })
        .catch(err => console.error('Error fetching recipe for edit:', err));
    } else {
      setIsEditMode(false);
      setFormData(initialState);
    }
  }, [params.id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : 0) : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (formData.prepTimeInMinutes < 1) newErrors.prepTimeInMinutes = 'Prep time must be at least 1 minute';
    if (formData.cookTimeInMinutes < 1) newErrors.cookTimeInMinutes = 'Cook time must be at least 1 minute';
    if (formData.servings < 1) newErrors.servings = 'Servings must be at least 1';
    if (!formData.ingredients) newErrors.ingredients = 'At least one ingredient is required';
    if (!formData.instructions) newErrors.instructions = 'At least one instruction is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

   

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        ...formData,
        userId: userId,
        // Convert comma-separated strings to arrays for the API
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        instructions: formData.instructions.split(',').map(s => s.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
      };

      try {
        if (isEditMode) {
          await api.put(`/recipe/${editId}`, payload);
        } else {
          await api.post('/recipe', payload);
        }
        localStorage.removeItem('editId'); // Clear editId after successful operation
        navigate('/chef/dashboard');
      } catch (error) {
        console.error('Error saving recipe:', error);
        setErrors(prev => ({ ...prev, api: 'Failed to save recipe.' }));
      }
    }
  };

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Salad', 'Main-course', 'Side-dish', 'Snacks', 'Dessert', 'Others'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const cuisines = ['Italian', 'French', 'American', 'Thai', 'Indian', 'Chinese', 'Mexican', 'Japanese', 'Others'];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>{isEditMode ? 'Update Recipe' : 'Add Recipe'}</h1>
        <button onClick={() => navigate('/chef/dashboard')} className="button button-cancel">
          Cancel
        </button>
      </header>

      <form onSubmit={handleSubmit} className="recipe-form">
        {errors.api && <p className="error-message">{errors.api}</p>}

        {/* Render all form fields as required by the test */}
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="error-message">{errors.category}</p>}
          </div>

         

          <div className="form-group">
            <label>Difficulty:</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="">Select Difficulty</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.difficulty && <p className="error-message">{errors.difficulty}</p>}
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Prep Time (minutes):</label>
            <input type="number" name="prepTimeInMinutes" value={formData.prepTimeInMinutes} onChange={handleChange} />
            {errors.prepTimeInMinutes && <p className="error-message">{errors.prepTimeInMinutes}</p>}
          </div>

          <div className="form-group">
            <label>Cook Time (minutes):</label>
            <input type="number" name="cookTimeInMinutes" value={formData.cookTimeInMinutes} onChange={handleChange} />
            {errors.cookTimeInMinutes && <p className="error-message">{errors.cookTimeInMinutes}</p>}
          </div>

          <div className="form-group">
            <label>Servings:</label>
            <input type="number" name="servings" value={formData.servings} onChange={handleChange} />
            {errors.servings && <p className="error-message">{errors.servings}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Cuisine:</label>
          <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
            <option value="">Select Cuisine (Optional)</option>
            {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Ingredients (comma-separated):</label>
          <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} />
          {errors.ingredients && <p className="error-message">{errors.ingredients}</p>}
        </div>

        <div className="form-group">
          <label>Instructions (comma-separated):</label>
          <textarea name="instructions" value={formData.instructions} onChange={handleChange} />
          {errors.instructions && <p className="error-message">{errors.instructions}</p>}
        </div>

        <div className="form-group">
          <label>Tags (comma-separated):</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </div>

        <button type="submit" className="button button-submit">
          {isEditMode ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;