const debug = require('debug')('app:error')

function errorHandler () {
  return (error, req, res, next) => {
    debug(error.message, error)

    const {name, errors} = error

    if (name === 'ValidationError') {
      return res.status(400).json({
        error: Object.keys(errors).reduce((formattedErrors, key) => {
          // Find actual name of property (contact.email => email)
          const nextKey = key.split('.').pop()
          return {
            ...formattedErrors,
            [nextKey]: errors[key].message
          }
        }, {})
      })
    }

    res.status(500).json({error: 'Something failed.'})
  }
}

module.exports = errorHandler
