// This file exists to satisfy the test import `require('../authUtils')`
const { validateToken } = require('./middleware/authMiddleware');

module.exports = {
  validateToken
};