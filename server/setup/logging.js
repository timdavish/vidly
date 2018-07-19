const morgan = require('morgan')
const debug = require('debug')('app:setup')

function setup (app) {
  process.on('uncaughtException', (ex) => debug('UNCAUGHT EXCEPTION:', ex))
  process.on('unhandledRejection', (ex) => debug('UNHANDLED REJECTION:', ex))

  const morganFormat = process.env.NODE_ENV === 'dev' ? 'dev' : 'combined'
  app.use(morgan(morganFormat, {skip: (req, res) => res.statusCode < 400, stream: process.stderr}))
  app.use(morgan(morganFormat, {skip: (req, res) => res.statusCode >= 400, stream: process.stdout}))

  debug('Logging setup.')
}

module.exports = setup
