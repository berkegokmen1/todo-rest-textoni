const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const Todo = require('./todo.model');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    accessTokens: [{ type: String, default: [] }],

    todolist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        default: [],
        required: true,
      },
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }
);

userSchema.virtual('numTodo').get(function () {
  if (this.todolist) {
    return this.todolist.length;
  }
  return 0;
});

userSchema.pre('remove', async function (next) {
  try {
    const user = this;

    await Todo.deleteMany({ owner: user._id }).exec();

    next();
  } catch (error) {
    return createError.InternalServerError();
  }
});

userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 12);
    }
    next();
  } catch (error) {
    throw createError.InternalServerError();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
