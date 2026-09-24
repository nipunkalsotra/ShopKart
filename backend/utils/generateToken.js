const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true,
    sameSite: 'strict', // prevent CSRF
    secure: process.env.NODE_ENV !== 'development'
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
