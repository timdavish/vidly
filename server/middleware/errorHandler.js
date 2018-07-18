function errorHandler () {
  return (error, req, res, next) => {
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

    next(error)
  }
}

module.exports = errorHandler
