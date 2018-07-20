const router = require('express').Router()
require('express-async-errors')

router.use('/health', (req, res) => res.sendStatus(200))
router.use('/api', require('./api'))

module.exports = router
