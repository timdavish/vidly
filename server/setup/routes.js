const bodyParser = require('body-parser')
const helmet = require('helmet')
const debug = require('debug')('app:setup')
const routes = require('../routes')
const errorHandler = require('../middleware/errorHandler')

function setup (app) {
  app.use(bodyParser.json({limit: '1mb'}))
  app.use(bodyParser.urlencoded({extended: true}))

  app.use(helmet())
  app.use('/', routes)
  app.use(errorHandler())

  debug('Routes setup.')
}

module.exports = setup
