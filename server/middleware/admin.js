function admin (req, res, next) {
  if (!req.user) return res.status(401).json({error: 'Access denied. User not authenticated.'})
  if (!req.user.isAdmin) return res.status(403).json({error: 'Access denied.'})

  next()
}

module.exports = admin
