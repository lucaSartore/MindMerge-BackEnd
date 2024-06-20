const express = require('express');
const cors = require('cors');
const {accountRouter, userRouter} = require('./services/account_manager/account_manager.js');
const {organizationEditorRouter} = require('./services/organization_manager/organization_editor.js');
const {testingRouter} = require('./services/notification_manager/external_norification_manager.js');
const {taskRouter} = require('./services/task_manager/task_router.js');
const app = express();
const {authenticationMiddleware} = require('./middleware/authentication_middleware.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/hello', async (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/account', accountRouter);

// Middleware to verify the user token
app.use(authenticationMiddleware);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/organization', organizationEditorRouter);

if (process.env.NODE_ENV === 'development') {
  app.use('/api/v1/testing', testingRouter);
}
app.use('/api/v1/task', taskRouter);

module.exports = app;
