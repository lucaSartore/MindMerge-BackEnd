const express = require('express');
const cors = require('cors');
const {accountManagerRouter} = require('./services/account_manager/account_manager.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// app.get('api/v2/account', (req, res) => {
//   res.send('');
// });
app.use('/api/v1/account', accountManagerRouter);

module.exports = app;