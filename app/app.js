const express = require('express');
const cors = require('cors');
const {accountRouter, userRouter} = require('./services/account_manager/account_manager.js');
const {organizationEditorRouter} = require('./services/organization_manager/organization_editor.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/account', accountRouter);

// insert here the middleware to verify the user token
// qui metti un middleware che verifica il token dell'utente\
// se va tutto bene manda avanti... altrimenti ritorna unauthorized
// GIOELE TODO

app.use('/api/v1/user', userRouter);
app.use('/api/v1/organization', organizationEditorRouter);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error',
    payload: null,
  });
});


module.exports = app;