const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/customers', require('./customers'))
router.use('/genres', require('./genres'))
router.use('/movies', require('./movies'))
router.use('/rentals', require('./rentals'))
router.use('/users', require('./users'))

module.exports = router
