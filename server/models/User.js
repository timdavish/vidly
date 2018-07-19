const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const {authConfig} = require('../config')

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
  isAdmin: Boolean,
})

userSchema.methods.toJSON = function () {
  const userJSON = {
    _id: this._id,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin,
  }

  return userJSON
}

userSchema.methods.generateAuthToken = function () {
  const userJSON = this.toJSON()
  const token = jwt.sign(userJSON, authConfig.jwtSecret)

  return token
}

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
