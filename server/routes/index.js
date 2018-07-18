const router = require('express').Router()

router.use('/health', (req, res) => res.sendStatus(200))
router.use('/api', require('./api'))
router.get('/', index)

function index (req, res) {
  res.sendFile('../public/index.html')
}

module.exports = router
