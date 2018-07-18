const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
})

const User = mongoose.model('User', userSchema)

function validateUser (user) {
  const schema = {
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().required().min(5).max(1024),
  }

  return Joi.validate(user, schema)
}

module.exports = {User, validateUser}
