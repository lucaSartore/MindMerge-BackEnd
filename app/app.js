const express = require('express');
const cors = require('cors');
const {accountRouter, userRouter} = require('./services/account_manager/account_manager.js');
const {organizationEditorRouter} = require('./services/organization_manager/organization_editor.js');
const {testingRouter} = require('./services/notification_manager/external_norification_manager.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const {promptLlm} = require('./services/report_manager/llm_prompter.js');
app.get('/hello', async (req, res) => {
  let x = await promptLlm("write me a python script that prints 'hello world'");
  res.send(x);
  //res.send('Hello World!');

});

app.use('/api/v1/account', accountRouter);

// insert here the middleware to verify the user token

app.use('/api/v1/user', userRouter);
app.use('/api/v1/organization', organizationEditorRouter);
if (process.env.NODE_ENV === 'development') {
  app.use('/api/v1/testing', testingRouter);
}

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