const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { validateToken } = require('../middleware/authMiddleware');

// Using POST to allow for sort options in the body, as per the test
router.post('/all', recipeController.getAllRecipes);

// Get recipes for a specific user, using POST as per test
router.post('/user', validateToken, recipeController.getRecipesByUserId);

// Get a single recipe
router.get('/:id', recipeController.getRecipeById);

// Protected routes
router.post('/', validateToken, recipeController.addRecipe);
router.put('/:id', validateToken, recipeController.updateRecipe);
router.delete('/:id', validateToken, recipeController.deleteRecipe);

module.exports = router;