const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const ACCESS_EXPIRATION = parseInt(process.env.JWT_ACCESS_EXPIRATION);

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {},
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: ACCESS_EXPIRATION,
        issuer: process.env.JWT_ISSUER,
        audience: userId,
      },
      (err, token) => {
        if (err) return reject(createError.InternalServerError());

        return resolve(token);
      }
    );
  });
};

module.exports = {
  signAccessToken,
};
