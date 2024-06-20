const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {accountRouter, userRouter, accountManager} = require('./services/account_manager/account_manager.js');
const {organizationEditorRouter} = require('./services/organization_manager/organization_editor.js');
const { Errors } = require('./common_infrastructure/errors.js');
const {testingRouter} = require('./services/notification_manager/external_norification_manager.js');
const {taskRouter} = require('./services/task_manager/task_router.js');
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

// Middleware to verify the user token
app.use(async (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['token'];

    if (!token) res.status(403).json({success:false, message: 'No token provided.'})

    jwt.verify (
        token,
        process.env.SUPER_SECRET,
        async function(err, decoded) {
            if (err)
                res.status(403).json({success:false, message: 'Invalid token'})
            else {
                req.loggedUser = decoded.userId * 1;
                let organizationId = req.params.organization_id || req.query.organization_id;
                
                if (!organizationId){
                    next();
                    return;
                }
                organizationId = organizationId * 1;
                
                let isInOrganization = await accountManager.verifyUserIsInOrganization(req.loggedUser, organizationId)
                if (isInOrganization.statusCode != Errors.OK){
                    res.status(isInOrganization.statusCode).json(isInOrganization);
                    return;
                }
                if (!isInOrganization.payload){
                    res.status(403).json({success:false, message: 'User has no access to the requested organization'});
                    return;
                }
                // TODO: match organization_id with user request
                next();
            }
        }
    )
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/organization', organizationEditorRouter);

if (process.env.NODE_ENV === 'development') {
  app.use('/api/v1/testing', testingRouter);
}
app.use('/api/v1/task', taskRouter);

module.exports = app;
