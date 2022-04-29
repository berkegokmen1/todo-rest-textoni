const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.routes');
const todoRoutes = require('./todo.routes');

router.use('/auth', authRoutes);

router.use('/todo', todoRoutes);

module.exports = router;
