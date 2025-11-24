// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    error: 'Unauthorized. Please login first.',
    message: 'You must be logged in to access this resource',
    loginUrl: '/auth/google'
  });
};

module.exports = { isAuthenticated };