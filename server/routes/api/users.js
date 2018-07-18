const router = require('express').Router()
const {User, validateUser} = require('../../models/User')

router.post('/', async (req, res) => {
  const {error} = validateUser(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  let user = await User.findOne({email: req.body.email})
  if (user) return res.status(400).json({error: 'User already registered'})

  user = new User({name: req.body.name, email: req.body.email, password: req.body.password})
  await user.save()

  res.json({user})
})

module.exports = router
