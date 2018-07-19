const router = require('express').Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const {User, validateUser} = require('../../models/User')

router.get('/me', auth.required, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.json({user})
})

router.post('/', async (req, res) => {
  const {error} = validateUser(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  let user = await User.findOne({email: req.body.email})
  if (user) return res.status(400).json({error: 'User already registered'})

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  user.password = hash
  await user.save()

  const token = user.generateAuthToken()

  res.header('x-auth-token', token).json({user: _.pick(user, ['name', 'email'])})
})

module.exports = router
