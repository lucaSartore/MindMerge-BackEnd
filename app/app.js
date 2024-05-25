const express = require('express');
const cors = require('cors');
const {accountRouter, userRouter} = require('./services/account_manager/account_manager.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/account', accountRouter);

// insert here the middleware to verify the user token

app.use('/api/v1/user', userRouter);

module.exports = app;