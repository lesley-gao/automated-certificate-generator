// Simple stub for authentication
module.exports = {
  isAuthenticated: (req, res, next) => {
    // Always allow for MVP
    req.user = { name: 'Demo User' };
    next();
  }
};
