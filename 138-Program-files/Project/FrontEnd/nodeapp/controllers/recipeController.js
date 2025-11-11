const Recipe = require('../models/recipeModel');

const getAllRecipes = async (req, res) => {
  try {
    const sortOrder = req.body.sortOrder || 1; // Default to ascending
    const recipes = await Recipe.find().sort({ prepTimeInMinutes: sortOrder });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    await Recipe.create(req.body);
    res.status(200).json({ message: 'Recipe Added Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipesByUserId = async (req, res) => {
  try {
    const { userId, category } = req.body;
    let query = { userId: userId };
    
    // As per the test, the category is part of the filter
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    
    const recipes = await Recipe.find(query);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesByUserId
};