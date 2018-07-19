const debug = require('debug')('app:setup')
const {authConfig, dbConfig} = require('../config')

function validate () {
  if (!authConfig.jwtSecret) {
    throw new Error('FATAL ERROR: authConfig.jwtSecret is not set')
  }

  if (!dbConfig.url) {
    throw new Error('FATAL ERROR: dbConfig.url is not set')
  }

  debug('Config validated.')
}

module.exports = validate
