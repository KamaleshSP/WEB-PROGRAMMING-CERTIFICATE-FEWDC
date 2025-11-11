const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Validates 10-digit number
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'chef', 'admin'], // Assuming roles
    default: 'user'
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255 
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;