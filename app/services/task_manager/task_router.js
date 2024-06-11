const express = require('express');
const {taskGetter} = require('./task_getter');
const { Task } = require('../../common_infrastructure/task.js');
const { taskCreator} = require('./task_creator');
const { taskEditor } = require('./task_editor.js'); 
const { TaskNote } = require('../../common_infrastructure/task_note.js');
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

taskRouter.put("/:task_id/notes/:notes_id", async (req,res) => {
        const taskId = req.params.task_id * 1;
        const organizationId = req.query.organization_id * 1;
        const noteId = req.params.notes_id * 1;
        const newNotes = req.body.notes;
        let response = await taskEditor.updateTaskNotes(organizationId,taskId,noteId,newNotes,null,null);
        res.status(response.statusCode);
        res.json(response);
});

taskRouter.post("/", async (req,res) =>{

    let task = req.body;
    task = Object.assign(new Task(), task);
    task.lastUpdated = new Date(task.lastUpdated);
    let response = await taskCreator.createTask(task.taskOrganizationId, task, undefined, undefined);

    res.status(response.statusCode);
    res.json(response);
});

taskRouter.post("/:task_id/notes/", async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    let taskNote = req.body;
    taskNote = Object.assign(new TaskNote(), taskNote);
    let response = await taskEditor.createTaskNotes(organizationId,taskNote.taskId,taskNote.notes);
    res.status(response.statusCode);
    res.json(response);
});

taskRouter.delete("/:task_id", async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    const taskId = req.params.task_id * 1;
    
});

exports.taskRouter = taskRouter;