const router = require('express').Router()
const mongoose = require('mongoose')
const Fawn = require('fawn').init(mongoose)
const {Rental, validateRental} = require('../../models/Rental')
const {Customer} = require('../../models/Customer')
const {Movie} = require('../../models/Movie')

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')
  res.json({rentals})
})

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id)
  if (!rental) return res.status(404).json({error: 'The rental with the given id was not found'})

  res.json({rental})
})

router.post('/', async (req, res) => {
  const {error} = validateRental(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).json({error: 'Invalid customer'})

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).json({error: 'Invalid movie'})

  if (movie.numberInStock === 0) return res.status(400).json({error: 'Movie not in stock'})

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    }
  })

  try {
    new Fawn.task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
      .run()

    res.json({rental})
  } catch (error) {
    res.status(500).json({error: 'Something failed'})
  }
})

router.put('/:id', async (req, res) => {
  const {error} = validateRental(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  const rental = await Rental.findByIdAndUpdate(req.params.id, {title: req.body.title}, {new: true})
  if (!rental) return res.status(404).json({error: 'The rental with the given id was not found'})

  res.json({rental})
})

router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id)
  if (!rental) return res.status(404).json({error: 'The rental with the given id was not found'})

  res.json({rental})
})

module.exports = router
