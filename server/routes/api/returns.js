const router = require('express').Router()
const Joi = require('joi')
const auth = require('../../middleware/auth')
const validate = require('../../middleware/validateRequest')
const {Rental} = require('../../models/Rental')
const {Movie} = require('../../models/Movie')

router.post('/', [auth.required, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
  if (!rental) return res.status(404).json({error: 'The rental with the given id was not found'})

  if (typeof rental.dateIn !== 'undefined' || typeof rental.rentalFee !== 'undefined') {
    return res.status(400).json({error: 'This return was already processed'})
  }

  await rental.return()
  await Movie.update({_id: rental.movie._id}, {$inc: {numberInStock: 1}})

  res.json({rental})
})

function validateReturn (req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }

  return Joi.validate(req, schema)
}

module.exports = router
