if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const createError = require('http-errors');
const routes = require('./routes/routes');

const connectMongoose = require('./database/mongoose.db');

const app = express();

// Parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Response header
app.use(helmet());

// Cors
app.options('*', cors()); // ???

// Prevent against nosql query injection attacks
app.use(
  mongoSanitize({
    onSanitize: (_) => {
      throw createError.Forbidden();
    },
  })
);

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use(routes);

app.use('*', (req, res, next) => {
  return res.status(404).json({
    success: false,
    Data: {
      error: 'Endpoint not found.',
    },
  });
});

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(error);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    Data: {
      error: error.message,
    },
  });
});

connectMongoose()
  .then((_) => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, (_) => {
      console.log('Server is up and running on port', PORT);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
