const router = require('express').Router()
const bcrypt = require('bcrypt')
const _ = require('lodash')
const Joi = require('joi')
const {User} = require('../../models/User')

router.post('/', async (req, res) => {
  const {error} = validateAuth(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  let user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).json({error: 'Invalid email or password'})

  const isValidPassword = await bcrypt.compare(req.body.password, user.password)
  if (!isValidPassword) return res.status(400).json({error: 'Invalid email or password'})

  const token = user.generateAuthToken()

  res.json({token})
})

function validateAuth (req) {
  const schema = {
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().required().min(5).max(1024),
  }

  return Joi.validate(user, schema)
}

module.exports = router
