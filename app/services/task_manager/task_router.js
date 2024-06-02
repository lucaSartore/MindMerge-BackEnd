const express = require('express');
const {taskGetter} = require('./task_getter');
const { Task } = require('../../common_infrastructure/task.js');
const { taskCreator} = require('./task_creator');
const { taskEditor } = require('./task_editor.js') 
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



taskRouter.put("/:task_id/name/:new_name", async (req,res) => {

    const taskId = req.params.task_id*1;
    const organizationId = req.query.organization_id * 1;
    const newName = req.params.new_name;

    let response = await taskEditor.updateTaskName(organizationId,taskId,newName,null,null);
    res.status(response.statusCode);
    res.json(response);
})

taskRouter.post("/", async (req,res) =>{

    let task = req.body;
    task = Object.assign(new Task(), task);
    task.lastUpdated = new Date(task.lastUpdated);
    let response = await taskCreator.createTask(task.taskOrganizationId, task, undefined, undefined);

    res.status(response.statusCode);
    res.json(response);
});


exports.taskRouter = taskRouter;