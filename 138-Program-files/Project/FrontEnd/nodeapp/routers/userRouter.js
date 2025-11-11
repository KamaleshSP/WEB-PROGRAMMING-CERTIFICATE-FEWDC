const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Using POST for login as it checks credentials in the body
router.post('/login', userController.getUserByUsernameAndPassword);

router.post('/register', userController.addUser);

router.get('/', userController.getAllUsers);

module.exports = router;