module.exports = function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    // ✅ User is logged in, continue to next route/controller
    return next();
  } else {
    // ❌ No session found, block access
    return res.status(401).json({ error: "❌Unauthorized. Please login first." });
  }
};
