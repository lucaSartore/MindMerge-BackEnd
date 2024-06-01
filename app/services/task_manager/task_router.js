const express = require('express');
const {taskGetter} = require('./task_getter');
const taskRouter = express.Router();


taskRouter.get('/task_tree', async (req, res) => {

    const userId = req.query.user_id * 1;
    const organizationId = req.query.organization_id * 1;

    let response = await taskGetter.getTasksForUser(organizationId, userId);
    res.status(response.statusCode);
    res.json(response);
});


taskRouter.get('/:task_id', async (req, res) => {

    const taskId = req.params.task_id * 1;
    const organizationId = req.query.organization_id * 1;

    let response = await taskGetter.getTask(organizationId, taskId,null,null);
    res.status(response.statusCode);
    res.json(response);
});


exports.taskRouter = taskRouter;