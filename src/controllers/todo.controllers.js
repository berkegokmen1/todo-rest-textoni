const createError = require('http-errors');
const mongoose = require('mongoose');

const Todo = require('../models/todo.model');

const putTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return next(createError.BadRequest('Title must be specified.'));
    }

    const todo = new Todo({
      title,
      description: description || '',
      owner: req.user._id,
    });

    req.user.todolist.push(todo._id);

    await Promise.all([req.user.save(), todo.save()]);

    return res.status(201).json({
      success: true,
      Data: {
        _id: todo._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTodo = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await user.populate({
      path: 'todolist',
      select: '_id title description createdAt',
    });

    return res.json({
      success: true,
      Data: { todos: result.todolist },
    });
  } catch (error) {
    next(error);
  }
};

const getTodoId = async (req, res, next) => {
  if (!req.params.id) {
    return next(createError.BadRequest('No id provided.'));
  }

  let id;

  try {
    id = mongoose.Types.ObjectId(req.params.id);
  } catch (error) {
    return next(createError.BadRequest('Please provide a valid id.'));
  }

  const index = req.user.todolist.indexOf(id);

  if (index === -1) {
    return next(createError.NotFound('Todo not found.'));
  }

  const todo = await Todo.findById(id).select('title description').exec();

  if (!todo) {
    return next(createError.NotFound('Todo could not be found.'));
  }

  return res.json({
    success: true,
    Data: todo,
  });
};

const getTodoSearch = async (req, res, next) => {
  try {
    if (!req.query.q) {
      return next(createError.BadRequest('Please provide a query string.'));
    }

    if (req.query.q.length > 16) {
      return next(
        createError.BadRequest(
          'Query string cannot be longer than 16 characters.'
        )
      );
    }

    const result = await Todo.search(req.query.q, req.user._id);

    return res.json({
      success: true,
      Data: {
        todos: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(createError.BadRequest('No id provided.'));
    }

    let id;

    try {
      id = mongoose.Types.ObjectId(req.params.id);
    } catch (error) {
      return next(createError.BadRequest('Please provide a valid id.'));
    }

    const { title, description } = req.body;

    if (!title && !description) {
      return next(
        createError.BadRequest('New title or description must be specified.')
      );
    }

    const index = req.user.todolist.indexOf(id);

    if (index === -1) {
      return next(createError.NotFound('Todo not found.'));
    }

    const todo = await Todo.findById(id).exec();

    if (!todo) {
      return next(createError.NotFound('Todo could not be found.'));
    }

    // We have the todo that belongs to the user here
    if (title) {
      todo.title = title;
    }
    if (description) {
      todo.description = description;
    }

    await todo.save();

    return res.status(200).json({
      success: true,
      Data: {
        message: 'Todo updated',
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(createError.BadRequest('No id provided.'));
    }

    let id;

    try {
      id = mongoose.Types.ObjectId(req.params.id);
    } catch (error) {
      return next(createError.BadRequest('Please provide a valid id.'));
    }

    const index = req.user.todolist.indexOf(id);

    if (index === -1) {
      return next(createError.NotFound('Todo not found.'));
    }

    const todo = await Todo.findById(id).exec();

    if (!todo) {
      return next(createError.NotFound('Todo could not be found.'));
    }

    // Remove todo from user's list
    req.user.todolist.splice(index, 1);

    // Remove todo from db
    await Promise.all([todo.remove(), req.user.save()]);

    return res.status(200).json({
      success: true,
      Data: {
        message: 'Todo removed.',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  putTodo,
  getTodo,
  getTodoId,
  getTodoSearch,
  updateTodo,
  deleteTodo,
};
