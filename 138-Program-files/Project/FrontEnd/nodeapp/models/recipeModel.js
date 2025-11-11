const mongoose = require('mongoose');

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Salad', 'Main-course', 'Side-dish', 'Snacks', 'Dessert', 'Others'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const cuisines = ['Italian', 'French', 'American', 'Thai', 'Indian', 'Chinese', 'Mexican', 'Japanese', 'Others'];

const nutritionalInfoSchema = new mongoose.Schema({
  calories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: categories,
  },
  difficulty: {
    type: String,
    required: true,
    enum: difficulties,
  },
  prepTimeInMinutes: {
    type: Number,
    required: true,
    min: 1,
  },
  cookTimeInMinutes: {
    type: Number,
    required: true,
    min: 1,
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
  },
  cuisine: {
    type: String,
    enum: cuisines,
  },
  ingredients: {
    type: [String],
    required: true,
    validate: [v => Array.isArray(v) && v.length > 0, 'At least one ingredient is required']
  },
  instructions: {
    type: [String],
    required: true,
    validate: [v => Array.isArray(v) && v.length > 0, 'At least one instruction is required']
  },
  tags: {
    type: [String],
  },
  notes: {
    type: String,
  },
  nutritionalInfo: nutritionalInfoSchema,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;