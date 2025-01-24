const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        code: 401,
        success: false,
        message: 'Unauthorized access. No token provided.',
        error: true,
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send({
        code: 401,
        success: false,
        message: 'Unauthorized access. Malformed token.',
        error: true,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info from token to the request
    console.log("Decoded user from token:", decoded); // Log the decoded user for debugging
    next();
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(401).send({
      code: 401,
      success: false,
      message: 'Unauthorized access. Invalid token.',
      error: true,
    });
  }
};

module.exports = { validateToken };
