const router = require('express').Router()
const {Customer, validateCustomer} = require('../../models/Customer')

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name')
  res.json({customers})
})

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer) return res.status(404).json({error: 'The customer with the given id was not found'})

  res.json({customer})
})

router.post('/', async (req, res) => {
  const {error} = validateCustomer(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  const customer = new Customer({name: req.body.name})
  await customer.save()

  res.json({customer})
})

router.put('/:id', async (req, res) => {
  const {error} = validateCustomer(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
  if (!customer) return res.status(404).json({error: 'The customer with the given id was not found'})

  res.json({customer})
})

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)
  if (!customer) return res.status(404).json({error: 'The customer with the given id was not found'})

  res.json({customer})
})

module.exports = router
