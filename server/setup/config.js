const debug = require('debug')('app:setup')
const {authConfig} = require('../config')

function validate () {
  if (!authConfig.jwtSecret) {
    throw new Error('FATAL ERROR: jwtSecret is not set')
  }

  debug('Config validated.')
}

module.exports = validate
