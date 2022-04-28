const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const User = require('../models/user.model');

const auth = async (req, res, next) => {
  const accessTokenHeader = req.header('Authorization');

  if (!accessTokenHeader) {
    return next(createError.Unauthorized());
  }

  let accessToken;
  try {
    accessToken = accessTokenHeader.split(' ')[1]; // Access token
  } catch (error) {
    return next(createError.BadRequest('Invalid format for the token.'));
  }

  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET,
    async (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthroized' : err.message;

        return next(createError.Unauthorized(message));
      }

      // Find user and attach to the req object
      const user = await User.findById(payload.aud /* userId */).exec();

      if (!user) {
        return next(createError.Unauthorized());
      }

      const tokenCheck = user.accessTokens.indexOf(accessToken) >= 0;

      if (!tokenCheck) {
        return next(createError.Unauthorized());
      }

      req.user = user;

      return next();
    }
  );
};

module.exports = auth;
