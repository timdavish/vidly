const router = require('express').Router()
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')
const {Genre, validateGenre} = require('../../models/Genre')

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')
  res.json({genres})
})

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).json({error: 'The genre with the given id was not found'})

  res.json({genre})
})

router.post('/', auth.required, async (req, res) => {
  const {error} = validateGenre(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  const genre = new Genre({name: req.body.name})
  await genre.save()

  res.json({genre})
})

router.put('/:id', async (req, res) => {
  const {error} = validateGenre(req.body)
  if (error) return res.status(400).json({error: error.details[0].message})

  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
  if (!genre) return res.status(404).json({error: 'The genre with the given id was not found'})

  res.json({genre})
})

router.delete('/:id', [auth.required, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if (!genre) return res.status(404).json({error: 'The genre with the given id was not found'})

  res.json({genre})
})

module.exports = router
