const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth.middleware');

const {
  putTodo,
  getTodo,
  getTodoId,
  getTodoSearch,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo.controllers');

router.put('/me', auth, putTodo);

router.get('/me', auth, getTodo);

router.get('/:id', auth, getTodoId);

router.get('/me/search', auth, getTodoSearch);

router.patch('/:id', auth, updateTodo);

router.delete('/:id', auth, deleteTodo);

module.exports = router;
