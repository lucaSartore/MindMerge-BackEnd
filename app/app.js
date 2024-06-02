const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {accountRouter, userRouter} = require('./services/account_manager/account_manager.js');
const {organizationEditorRouter} = require('./services/organization_manager/organization_editor.js');
const { Errors } = require('./errors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/account', accountRouter);

// Middleware to verify the user token
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(Errors.UNAUTHORIZED).json({
      code: Errors.UNAUTHORIZED,
      message: 'Unauthorized: No token provided',
      payload: null,
    });
  }

  jwt.verify(token, process.env.SUPER_SECRET, (err, decoded) => {
    if (err) {
      return res.status(Errors.UNAUTHORIZED).json({
        code: Errors.UNAUTHORIZED,
        message: 'Unauthorized: Invalid token',
        payload: null,
      });
    }
    req.user = decoded;
    next();
  });
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/organization', organizationEditorRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(Errors.INTERNAL_SERVER_ERROR).json({
    code: Errors.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
    payload: null,
  });
});

module.exports = app;
