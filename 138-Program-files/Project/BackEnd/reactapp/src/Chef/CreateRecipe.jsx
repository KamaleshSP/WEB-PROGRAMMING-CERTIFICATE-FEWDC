import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateRecipe.css';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const editId = localStorage.getItem('editId'); // Identify update or add mode

  const [recipeData, setRecipeData] = useState({
    title: '',
    category: '',
    difficulty: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    cuisine: '',
    ingredients: '',
    instructions: '',
    tags: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Prefill form if editing
  useEffect(() => {
    if (editId) {
      fetchRecipeForEdit(editId);
    }
  }, [editId]);

  const fetchRecipeForEdit = async (id) => {
    try {
      const response = await axios.get(`/recipes/getRecipeById/${id}`);
      const recipe = response.data;

      setRecipeData({
        title: recipe.title || '',
        category: recipe.category || '',
        difficulty: recipe.difficulty || '',
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || '',
        cuisine: recipe.cuisine || '',
        ingredients: recipe.ingredients?.join(', ') || '',
        instructions: recipe.instructions?.join(', ') || '',
        tags: recipe.tags?.join(', ') || '',
        notes: recipe.notes || ''
      });
    } catch {
      navigate('/error');
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    setRecipeData({ ...recipeData, [e.target.name]: e.target.value });
  };


// Validation logic
const validate = () => {
let validationErrors = {};

if (!recipeData.title) validationErrors.title = 'Title is required';
if (!recipeData.category) validationErrors.category = 'Category is required';
if (!recipeData.difficulty) validationErrors.difficulty = 'Difficulty is required';

if (!recipeData.prepTime || recipeData.prepTime < 1)
validationErrors.prepTime = 'Prep time must be at least 1 minute';

if (!recipeData.cookTime || recipeData.cookTime < 1)
validationErrors.cookTime = 'Cook time must be at least 1 minute';

if (!recipeData.servings || recipeData.servings < 1)
validationErrors.servings = 'Servings must be at least 1';

if (!recipeData.ingredients.trim())
validationErrors.ingredients = 'At least one ingredient is required';

if (!recipeData.instructions.trim())
validationErrors.instructions = 'At least one instruction is required';

return validationErrors;
};

const handleSubmit = async (e) => {
e.preventDefault();

const validationErrors = validate();
if (Object.keys(validationErrors).length > 0) {
setErrors(validationErrors);
return;
}

try {
const formattedData = {
...recipeData,
ingredients: recipeData.ingredients.split(',').map(i => i.trim()),
instructions: recipeData.instructions.split(',').map(i => i.trim()),
tags: recipeData.tags.split(',').map(i => i.trim())
};
if (editId) {
await axios.put(`/recipes/updateRecipe/${editId}`, formattedData);
} else {
const user = JSON.parse(localStorage.getItem('userData'));
await axios.post(`/recipes/addRecipe`, {
...formattedData,
userId: user?.userId
});
}





navigate('/manage-recipes');
} catch {
navigate('/error');
}
};

return (
<div className="form-container">
<h1>{editId ? 'Update Recipe' : 'Add Recipe'}</h1>
<form onSubmit={handleSubmit}>

{/* Title */}
<label>Title:</label>
<input type="text" name="title" value={recipeData.title} onChange={handleChange}/>
{errors.title && <span className="error">{errors.title}</span>}

{/* Category */}
<label>Category:</label>
<input type="text" name="category" value={recipeData.category} onChange={handleChange}/>
{errors.category && <span className="error">{errors.category}</span>}

{/* Difficulty */}
<label>Difficulty:</label>
<input type="text" name="difficulty" value={recipeData.difficulty} onChange={handleChange}/>
{errors.difficulty && <span className="error">{errors.difficulty}</span>}

{/* Prep Time */}
<label>Prep Time (minutes):</label>
<input type="number" name="prepTime" value={recipeData.prepTime} onChange={handleChange}/>
{errors.prepTime && <span className="error">{errors.prepTime}</span>}

{/* Cook Time */}
<label>Cook Time (minutes):</label>
<input type="number" name="cookTime" value={recipeData.cookTime} onChange={handleChange}/>
{errors.cookTime && <span className="error">{errors.cookTime}</span>}

{/* Servings */}
<label>Servings:</label>
<input type="number" name="servings" value={recipeData.servings} onChange={handleChange}/>
{errors.servings && <span className="error">{errors.servings}</span>}

{/* Cuisine */}
<label>Cuisine:</label>
<input type="text" name="cuisine" value={recipeData.cuisine} onChange={handleChange}/>

{/* Ingredients */}
<label>Ingredients (comma-separated):</label>
<textarea name="ingredients" value={recipeData.ingredients} onChange={handleChange}/>
{errors.ingredients && <span className="error">{errors.ingredients}</span>}

{/* Instructions */}
<label>Instructions (comma-separated):</label>
<textarea name="instructions" value={recipeData.instructions} onChange={handleChange}/>
{errors.instructions && <span className="error">{errors.instructions}</span>}

{/* Tags */}
<label>Tags (comma-separated):</label>
<textarea name="tags" value={recipeData.tags} onChange={handleChange}/>

{/* Notes */}
<label>Notes:</label>
<textarea name="notes" value={recipeData.notes} onChange={handleChange}/>

<button type="submit">{editId ? 'Update Recipe' : 'Add Recipe'}</button>
</form>
</div>
);
};

export default CreateRecipe;