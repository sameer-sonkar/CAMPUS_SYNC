const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded; // Attach the decoded payload (uid, etc.) to the request object
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { verifyToken };
