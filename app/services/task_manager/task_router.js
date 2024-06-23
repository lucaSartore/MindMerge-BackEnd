const express = require('express');
const {taskGetter} = require('./task_getter');
const { Task } = require('../../common_infrastructure/task.js');
const { taskCreator} = require('./task_creator');
const { taskEditor } = require('./task_editor.js'); 
const { TaskNote } = require('../../common_infrastructure/task_note.js');
const taskRouter = express.Router();
const {requestWrapper} = require('../../middleware/global_error_handler_middleware.js')

/**
  * @openapi
  * /api/v1/task/task_tree:
  *     get:
  *         summary: Get all tasks for a user and organization
  *         description: Get all tasks for a user with given id and organization with given id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: user_id
  *               description: The id of the user
  *               in: query
  *               required: false
  *               schema:
  *                 type : integer
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully returns the task tree
  *                 content:
  *                     application/json:   
  *                         schema:
  *                             type: string
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.get('/task_tree',requestWrapper( async (req, res) => {

    const userId = req.query.user_id * 1;
    const organizationId = req.query.organization_id * 1;
    let response = await taskGetter.getTasksForUser(organizationId, userId);
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}:
  *     get:
  *         summary: Get a task
  *         description: Get a task with given id and valid organization id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully returns the Task
  *                 content:
  *                     application/json:   
  *                         schema:
  *                             type: Task
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.get('/:task_id',requestWrapper( async (req, res) => {

    const taskId = req.params.task_id * 1;
    const organizationId = req.query.organization_id * 1;

    let response = await taskGetter.getTask(organizationId, taskId,null,null);
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}/name/{new_name}:
  *     put:
  *         summary: Update a task name
  *         description: Update a task name with given id and valid organization id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: new_name
  *               description: The new name of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : string  
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  * 
  *         responses:
  *             200:
  *                 description: Successfully updates the task name
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.put("/:task_id/name/:new_name",requestWrapper( async (req,res) => {

    const taskId = req.params.task_id*1;
    const organizationId = req.query.organization_id * 1;
    const newName = req.params.new_name;

    let response = await taskEditor.updateTaskName(organizationId,taskId,newName,null,null);
    res.status(response.statusCode);
    res.json(response);
}))

/**
  * @openapi
  * /api/v1/task/{task_id}/notes/{notes_id}:
  *     put:
  *         summary: Update a task note
  *         description: Update a task note with given id and valid organization id
  * 
  *         tags:
  *            - Tasks
  * 
  *         requestBody:
  *           description: The new notes for the task
  *           required: true
  *           content:
  *              application/json:
  *                 schema:      
  *                     type: object
  *                     properties:
  *                       notes:
  *                          type : string
  *
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: notes_id
  *               description: The id of the note
  *               in: path
  *               required: true
  *               schema:
  *                 type : string  
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully updates the task name
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.put("/:task_id/notes/:notes_id",requestWrapper( async (req,res) => {
        const taskId = req.params.task_id * 1;
        const organizationId = req.query.organization_id * 1;
        const noteId = req.params.notes_id * 1;
        const newNotes = req.body.notes;
        let response = await taskEditor.updateTaskNotes(organizationId,taskId,noteId,newNotes,null,null);
        res.status(response.statusCode);
        res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/:
  *     post:
  *         summary: Create a new task
  *         description: Create a new task with given data
  * 
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *           - name: Token
  *             description: The jwt (json web token) of the user
  *             in: header
  *             required: true
  *             schema:
  *               type : string
  *         requestBody:
  *             name: Task
  *             description: The Task data
  *             required: true
  *             content:
  *                application/json:
  *                   schema:      
  *                       type: object
  *                       properties:
  *                         childTasks:
  *                            type : array
  *                            items:
  *                              type: integer
  *                            default: []
  *                         lastUpdated:
  *                            type : string
  *                            format: date-time    
  *                         notificationEnable:
  *                           type : boolean
  *                           default: false
  *                         recursivePermissionsValue:
  *                           type : integer
  *                         taskAssignees:
  *                            type : array
  *                            items:
  *                              type: integer
  *                         taskDescription:
  *                           type : string
  *                           default: " "
  *                         taskFatherId:
  *                           type : integer
  *                           default: null
  *                         taskId:
  *                           type : integer
  *                           default: 1
  *                         taskManager:
  *                           type : integer
  *                         taskName:
  *                           type : string
  *                         taskNotes:
  *                            type : array
  *                            items:
  *                              type: object
  *                              properties:
  *                                 noteId:
  *                                    type : integer
  *                                 taskId:
  *                                    type : integer
  *                                 notes:
  *                                    type : string
  *                                 date:
  *                                    type : string
  *                                    format: date-time
  *                            default: null
  *                         taskOrganizationId:
  *                           type : integer
  *                         taskReports:
  *                           type : array
  *                           items:
  *                              type: object
  *                         taskStatus:
  *                           type : integer
  *         responses:
  *             200:
  *                 description: Successfully creates the task
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.post("/",requestWrapper( async (req,res) =>{

    let task = req.body;
    task = Object.assign(new Task(), task);
    task.lastUpdated = new Date(task.lastUpdated);
    let response = await taskCreator.createTask(task.taskOrganizationId, task, undefined, undefined);

    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}/notes/:
  *     post:
  *         summary: Create a new task note
  *         description: Create a new task note with given data
  * 
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *           - name: task_id
  *             description: The id of the task
  *             in: path
  *             required: true
  *             schema:
  *               type : integer
  *           - name: Token
  *             description: The jwt (json web token) of the user
  *             in: header
  *             required: true
  *             schema:
  *               type : string
  *         requestBody:
  *             name: Task
  *             description: The Task data
  *             required: true
  *             content:
  *                application/json:
  *                   schema:      
  *                       type: object
  *                       properties:
  *                         notes:
  *                            type : string
  *         responses:
  *             200:
  *                 description: Successfully creates the task note
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.post("/:task_id/notes/",requestWrapper( async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    let taskNote = req.body;
    taskNote = Object.assign(new TaskNote(), taskNote);
    let response = await taskEditor.createTaskNotes(organizationId,taskNote.taskId,taskNote.notes);
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}:
  *     delete:
  *         summary: Delete a task
  *         description: Delete a task with given id and valid organization id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully removes the task
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */


taskRouter.delete("/:task_id",requestWrapper( async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    const taskId = req.params.task_id * 1;
    let response = await taskEditor.deleteTask(organizationId,taskId,undefined,undefined);    
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}/notes/{note_id}:
  *     delete:
  *         summary: Delete a task note
  *         description: Delete a task note with given id and valid organization id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: note_id
  *               description: The id of the note
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully removes the task note
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.delete("/:task_id/notes/:note_id",requestWrapper( async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    const taskId = req.params.task_id * 1;
    const noteId = req.params.note_id * 1;
    let response = await taskEditor.deleteTaskNotes(organizationId,taskId,noteId);
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}/assignee/{assignee_id}:
  *     post:
  *         summary: Assign a new user to a task
  *         description: Assign a new user with given id to a task with given id and valid organization id
  * 
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *           - name: task_id
  *             description: The id of the task
  *             in: path
  *             required: true
  *             schema:
  *               type : integer
  *           - name: assignee_id
  *             description: The id of the assignee
  *             in: path
  *             required: true
  *             schema:
  *               type : integer
  *           - name: organization_id
  *             description: The id of the organization
  *             in: query
  *             required: true
  *             schema:
  *               type : integer
  *           - name: Token
  *             description: The jwt (json web token) of the user
  *             in: header
  *             required: true
  *             schema:
  *               type : string
  *         responses:
  *             200:
  *                 description: Successfully assigns the user to the task
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.post("/:task_id/assignee/:assignee_id",requestWrapper( async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    const taskId = req.params.task_id * 1;
    const assigneeId = req.params.assignee_id * 1;

    let response = await taskEditor.addNewAssignee(organizationId,taskId,assigneeId,null,null);
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}/assignee/{assignee_id}:
  *     delete:
  *         summary: Remove a user from a task
  *         description: Remove a user with given id from a task with given id and valid organization id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: assignee_id
  *               description: The id of the assignee
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully removes the user from the task
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.delete("/:task_id/assignee/:assignee_id",requestWrapper( async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    const taskId = req.params.task_id * 1;
    const assigneeId = req.params.assignee_id * 1;

    let response = await taskEditor.deleteTaskAssignee(organizationId,taskId,assigneeId,null,null);
    res.status(response.statusCode);
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/task/{task_id}/status/{new_status}:
  *     put:
  *         summary: Update a task status
  *         description: Update a task status with given id and valid organization id
  *
  *         tags:
  *            - Tasks
  * 
  *         parameters:
  *             - name: task_id
  *               description: The id of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: new_status
  *               description: The new status of the task
  *               in: path
  *               required: true
  *               schema:
  *                 type : string  
  *             - name: organization_id
  *               description: The id of the organization
  *               in: query
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully updates the task status
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

taskRouter.put("/:task_id/status/:new_status",requestWrapper( async (req,res) => {
    const organizationId = req.query.organization_id * 1;
    const taskId = req.params.task_id * 1;
    const newStatus = req.params.new_status * 1;

    let response = await taskEditor.updateTaskStatus(organizationId,taskId,newStatus,null,null);
    res.status(response.statusCode);
    res.json(response);
}));

exports.taskRouter = taskRouter;