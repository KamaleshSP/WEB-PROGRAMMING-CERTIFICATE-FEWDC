const userController = require('../controllers/userController');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const { getAllRecipes, addRecipe, updateRecipe, deleteRecipe, getRecipeById, getRecipesByUserId } = require('../controllers/recipeController');
const mongoose = require('mongoose');
const { validateToken } = require('../authUtils');


// Recipe Controller Tests
describe('getAllRecipes_Controller', () => {
  test('backend_getallrecipes_should_return_recipes_with_a_200_status_code', async () => {
    // Sample recipes data
    const recipesData = [
      {
        title: 'Pancakes',
        category: 'Breakfast',
        difficulty: 'Easy',
        prepTimeInMinutes: 10,
        cookTimeInMinutes: 15,
        servings: 4,
        userId: new mongoose.Types.ObjectId()
      },
      {
        title: 'Pasta Primavera',
        category: 'Dinner',
        difficulty: 'Medium',
        prepTimeInMinutes: 20,
        cookTimeInMinutes: 25,
        servings: 6,
        userId: new mongoose.Types.ObjectId()
      }
    ];

    const req = {
      body: { sortOrder: 1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Recipe.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(recipesData)
    });

    await getAllRecipes(req, res);

    expect(Recipe.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recipesData);
  });

  test('backend_getallrecipes_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    const error = new Error('Database error');

    const req = {
      body: { sortOrder: -1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Recipe.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockRejectedValue(error)
    });

    await getAllRecipes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('addRecipe_Controller', () => {
  test('backend_addrecipe_should_add_a_recipe_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample recipe data to be added
    const recipeToAdd = {
      title: 'Chocolate Cake',
      category: 'Dessert',
      difficulty: 'Hard',
      prepTimeInMinutes: 30,
      cookTimeInMinutes: 45,
      servings: 8,
      cuisine: 'American',
      ingredients: ['flour', 'sugar', 'cocoa powder', 'eggs'],
      instructions: ['mix dry ingredients', 'add wet ingredients', 'bake'],
      tags: ['chocolate', 'dessert', 'cake'],
      notes: 'Best served warm',
      userId: new mongoose.Types.ObjectId()
    };

    // Mock the Recipe.create method to resolve successfully
    Recipe.create = jest.fn().mockResolvedValue(recipeToAdd);

    // Mock Express request and response objects
    const req = { body: recipeToAdd };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the controller function
    await addRecipe(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe Added Successfully' });
  });

  test('backend_addrecipe_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    const error = new Error('Database error');

    Recipe.create = jest.fn().mockRejectedValue(error);

    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await addRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('updateRecipe_Controller', () => {
  test('backend_updaterecipe_should_update_recipe_and_respond_with_a_200_status_code_and_success_message', async () => {
    const recipeId = new mongoose.Types.ObjectId();
    const updatedRecipeData = {
      title: 'Updated Chocolate Cake',
      category: 'Dessert',
      difficulty: 'Medium',
      prepTimeInMinutes: 25,
      cookTimeInMinutes: 40,
      servings: 6,
      cuisine: 'French',
      ingredients: ['updated ingredients'],
      instructions: ['updated instructions'],
      tags: ['updated', 'tags'],
      notes: 'Updated notes',
      userId: new mongoose.Types.ObjectId()
    };

    const req = { params: { id: recipeId }, body: updatedRecipeData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedRecipeData);

    await updateRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe Updated Successfully' });
  });

  test('backend_updaterecipe_should_handle_not_finding_a_recipe_and_respond_with_a_404_status_code', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });

  test('backend_updaterecipe_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    const error = new Error('Database error');
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

    await updateRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('deleteRecipe_Controller', () => {
  test('backend_deleterecipe_should_delete_recipe_and_respond_with_a_200_status_code_and_success_message', async () => {
    const recipeId = new mongoose.Types.ObjectId();
    const req = { params: { id: recipeId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.findByIdAndDelete = jest.fn().mockResolvedValue({
      _id: recipeId,
      title: 'Sample Recipe',
      category: 'Breakfast',
      difficulty: 'Easy',
      userId: new mongoose.Types.ObjectId()
    });

    await deleteRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe Deleted Successfully' });
  });

  test('backend_deleterecipe_should_handle_not_finding_a_recipe_and_respond_with_a_404_status_code', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });

  test('backend_deleterecipe_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    const error = new Error('Database error');
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.findByIdAndDelete = jest.fn().mockRejectedValue(error);

    await deleteRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getRecipeById_Controller', () => {
  test('backend_getrecipebyid_should_return_a_recipe_with_a_200_status_code', async () => {
    const recipeId = new mongoose.Types.ObjectId();
    const recipeData = {
      _id: recipeId,
      title: 'Thai Green Curry',
      category: 'Dinner',
      difficulty: 'Medium',
      prepTimeInMinutes: 20,
      cookTimeInMinutes: 30,
      servings: 4,
      cuisine: 'Thai',
      userId: new mongoose.Types.ObjectId()
    };

    Recipe.findById = jest.fn().mockResolvedValue(recipeData);

    const req = { params: { id: recipeId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getRecipeById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recipeData);
  });

  test('backend_getrecipebyid_should_return_not_found_with_a_404_status_code', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Recipe.findById = jest.fn().mockResolvedValue(null);

    await getRecipeById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });

  test('backend_getrecipebyid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    const error = new Error('Database error');
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Recipe.findById = jest.fn().mockRejectedValue(error);

    await getRecipeById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getRecipesByUserId_Controller', () => {
  test('backend_getrecipesbyuserid_should_return_recipes_for_a_valid_userid_with_a_200_status_code', async () => {
    const userId = new mongoose.Types.ObjectId();
    const recipesData = [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Morning Smoothie',
        category: 'Breakfast',
        difficulty: 'Easy',
        prepTimeInMinutes: 5,
        userId
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Avocado Toast',
        category: 'Breakfast',
        difficulty: 'Easy',
        prepTimeInMinutes: 10,
        userId
      }
    ];

    const req = { body: { userId, category: 'Breakfast' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Recipe.find = jest.fn().mockResolvedValue(recipesData);

    await getRecipesByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recipesData);
  });

  test('backend_getrecipesbyuserid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    const error = new Error('Database error');
    const req = { body: { userId: new mongoose.Types.ObjectId(), category: 'Dinner' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Recipe.find = jest.fn().mockRejectedValue(error);

    await getRecipesByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('Recipe_Model_Validation', () => {
  test('backend_recipe_should_be_valid_with_correct_data', async () => {
    const validRecipeData = {
      title: 'Spaghetti Carbonara',
      category: 'Dinner',
      difficulty: 'Medium',
      prepTimeInMinutes: 15,
      cookTimeInMinutes: 20,
      servings: 4,
      cuisine: 'Italian',
      ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g parmesan'],
      instructions: ['Boil pasta', 'Cook pancetta', 'Mix eggs and cheese', 'Combine all'],
      tags: ['pasta', 'italian', 'comfort-food'],
      notes: 'Traditional Italian recipe',
      nutritionalInfo: {
        calories: 450,
        protein: 18,
        carbs: 55,
        fat: 16
      },
      userId: new mongoose.Types.ObjectId()
    };

    const recipe = new Recipe(validRecipeData);
    await expect(recipe.validate()).resolves.toBeUndefined();
  });

  test('backend_recipe_should_throw_validation_error_without_required_fields', async () => {
    const invalidRecipeData = {};

    const recipe = new Recipe(invalidRecipeData);
    await expect(recipe.validate()).rejects.toThrow();
  });

  test('backend_recipe_should_throw_validation_error_with_invalid_enum_values', async () => {
    const invalidRecipeData = {
      title: 'Invalid Recipe',
      category: 'Invalid Category', // Invalid
      difficulty: 'Expert', // Invalid
      prepTimeInMinutes: 10,
      cookTimeInMinutes: 15,
      servings: 2,
      cuisine: 'Invalid Cuisine', // Invalid
      ingredients: ['some ingredient'],
      instructions: ['some instruction'],
      userId: new mongoose.Types.ObjectId()
    };

    const recipe = new Recipe(invalidRecipeData);
    await expect(recipe.validate()).rejects.toThrow();
  });

  test('backend_recipe_should_throw_validation_error_with_negative_or_zero_values', async () => {
    const invalidRecipeData = {
      title: 'Faulty Recipe',
      category: 'Breakfast',
      difficulty: 'Easy',
      prepTimeInMinutes: -5, // Invalid
      cookTimeInMinutes: 0, // Invalid
      servings: -1, // Invalid
      ingredients: ['ingredient'],
      instructions: ['instruction'],
      userId: new mongoose.Types.ObjectId()
    };

    const recipe = new Recipe(invalidRecipeData);
    await expect(recipe.validate()).rejects.toThrow();
  });

  test('backend_recipe_should_throw_validation_error_with_empty_ingredients_or_instructions', async () => {
    const invalidRecipeData = {
      title: 'Empty Recipe',
      category: 'Lunch',
      difficulty: 'Easy',
      prepTimeInMinutes: 10,
      cookTimeInMinutes: 15,
      servings: 2,
      ingredients: [], // Invalid - empty array
      instructions: [], // Invalid - empty array
      userId: new mongoose.Types.ObjectId()
    };

    const recipe = new Recipe(invalidRecipeData);
    await expect(recipe.validate()).rejects.toThrow();
  });

  test('backend_recipe_should_accept_optional_fields_when_not_provided', async () => {
    const validRecipeData = {
      title: 'Simple Recipe',
      category: 'Snacks',
      difficulty: 'Easy',
      prepTimeInMinutes: 5,
      cookTimeInMinutes: 10,
      servings: 1,
      ingredients: ['bread', 'butter'],
      instructions: ['toast bread', 'spread butter'],
      userId: new mongoose.Types.ObjectId()
      // No cuisine, tags, notes, or nutritionalInfo
    };

    const recipe = new Recipe(validRecipeData);
    await expect(recipe.validate()).resolves.toBeUndefined();
  });
});



describe('getUserByUsernameAndPassword', () => {
  test('backend_getuserbyusernameandpassword_should_return_invalid_credentials_with_a_200_status_code', async () => {
    // Sample user credentials
    const userCredentials = {
      email: 'nonexistent@example.com',
      password: 'incorrect_password',
    };

    // Mock Express request and response objects
    const req = {
      body: userCredentials,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.findOne method to resolve with null (user not found)
    User.findOne = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await userController.getUserByUsernameAndPassword(req, res);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith(userCredentials);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
  });

  test('backend_getuserbyusernameandpassword_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.findOne
    const error = new Error('Database error');

    // Sample user credentials
    const userCredentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock Express request and response objects
    const req = {
      body: userCredentials,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.findOne method to reject with an error
    User.findOne = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await userController.getUserByUsernameAndPassword(req, res);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith(userCredentials);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('addUser', () => {
  test('backend_adduser_should_add_user_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample user data
    const userData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock Express request and response objects
    const req = {
      body: userData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.create method to resolve with the sample user data
    User.create = jest.fn().mockResolvedValue(userData);

    // Call the controller function
    await userController.addUser(req, res);

    // Assertions
    expect(User.create).toHaveBeenCalledWith(userData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  test('backend_adduser_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.create
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.create method to reject with an error
    User.create = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await userController.addUser(req, res);

    // Assertions
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getAllUsers', () => {
  test('backend_getallusers_should_return_users_and_respond_with_a_200_status_code', async () => {
    // Sample user data
    const usersData = [
      {
        _id: 'user1',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password1',
      },
      {
        _id: 'user2',
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'hashed_password2',
      },
    ];

    // Mock Express request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find method to resolve with the sample user data
    User.find = jest.fn().mockResolvedValue(usersData);

    // Call the controller function
    await userController.getAllUsers(req, res);

    // Assertions
    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({"users" : usersData});
  });

  test('backend_getallusers_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find method to reject with an error
    User.find = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await userController.getAllUsers(req, res);

    // Assertions
    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('User_Model_Schema_Validation', () => {
  test('backend_user_model_should_validate_a_user_with_valid_data', async () => {
    const validUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(validUserData);

    // Validate the user data against the schema
    await expect(user.validate()).resolves.toBeUndefined();
  });

  test('backend_user_model_should_validate_a_user_with_missing_required_fields', async () => {
    const invalidUserData = {
      // Missing required fields
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_user_model_should_validate_a_user_with_invalid_mobile_number_format', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: 'not-a-number',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
     await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_user_model_should_validate_a_user_with_invalid_email_format', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'invalid-email',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
     await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_user_model_should_validate_a_user_with_a_password_shorter_than_the_minimum_length', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'short',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
      await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_user_model_should_validate_a_user_with_a password_longer_than_the_maximum_length', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'a'.repeat(256),
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
     await expect(user.validate()).rejects.toThrowError();
  });
});




describe('validateToken', () => {
  test('backend_validatetoken_should_respond_with_400_status_and_error_message_if_invalid_token_is_provided', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue('invalidToken'),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });

  test('backend_validatetoken_should_respond_with_400_status_and_error_message_if_no_token_is_provided', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });
});