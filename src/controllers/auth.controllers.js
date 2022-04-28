const createError = require('http-errors');
const bcrypt = require('bcryptjs');

const { signAccessToken } = require('../helpers/jwt.util');
const { registerValidation } = require('../helpers/validator.util');

const User = require('../models/user.model');

const putRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const validationErrors = registerValidation(username, password);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        Data: {
          error: 'Validation Errors',
          validationErrors,
        },
      });
    } else {
      const usernameCheck = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, 'i') },
      })
        .lean()
        .exec();
      if (usernameCheck) {
        throw createError.Conflict('Username already exists.');
      }
    }

    const newUser = new User({
      username,
      password,
    });

    const userId = newUser._id.toString();

    const accessToken = await signAccessToken(userId);

    // Add new token to the database
    let temp = newUser.accessTokens || [];
    temp.push(accessToken);
    newUser.accessTokens = temp;

    await newUser.save();

    return res.status(201).json({
      success: true,
      Data: {
        _id: newUser._id,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return next(createError.Forbidden('User not found.'));
    }

    const passCheck = await bcrypt.compare(password, user.password);

    if (!passCheck) {
      return next(createError.Forbidden('Invalid credentials.'));
    }

    const userId = user._id.toString();

    const accessToken = await signAccessToken(userId);

    // Add new token to the database
    let temp = user.accessTokens || [];
    temp.push(accessToken);
    user.accessTokens = temp;

    await user.save();

    return res.status(200).json({
      success: true,
      Data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    let q = req.query.expand_todo || '';
    q = q.toString().toLowerCase();

    let result = req.user;

    if (q === '1' || q === 'true') {
      result = await req.user
        .populate({
          path: 'todolist',
          select: '_id title description createdAt',
          options: {
            sort: { createdAt: -1 },
          },
        })
        .execPopulate();
    }

    const { username, todolist, createdAt, ...rest } = result;

    return res.status(200).json({
      success: true,
      Data: {
        username,
        createdAt,
        todolist,
      },
    });
  } catch (error) {
    next(error);
  }
};

const postLogout = async (req, res, next) => {
  try {
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

    const indexOfToken = req.user.accessTokens.indexOf(accessToken);

    req.user.accessTokens.splice(indexOfToken, 1);

    await req.user.save();

    return res.status(200).json({
      success: true,
      Data: {
        message: 'Logout successful.',
      },
    });
  } catch (error) {
    next(error);
  }
};

const postLogoutAll = async (req, res, next) => {
  try {
    req.user.accessTokens = [];
    await req.user.save();

    return res.status(200).json({
      success: true,
      Data: {
        message: 'Logout from all successful.',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  putRegister,
  postLogin,
  getMe,
  postLogout,
  postLogoutAll,
};
