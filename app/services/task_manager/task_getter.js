const {ServicesBaseClass} = require('../services_base_class.js');
const {TaskTree} = require('../../common_infrastructure/task_tree.js');
const {Task} = require('../../common_infrastructure/task.js');
const {Errors} = require('../../common_infrastructure/errors.js');
const {CustomResponse} = require('../../common_infrastructure/response.js');
const express = require('express');

/**
 * @typedef TaskGetter 
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class TaskGetter extends ServicesBaseClass{
    
    /**
     * returns the task trees a user can see inside an organization 
     * @param {number} organizationId 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<TaskTree[]>}
     */
    async getTasksForUser(organizationId, userId, userToken){
        let result = await this.taskManager.readRootTasks(organizationId);
        if(result.statusCode !== Errors.OK){
            return result;
        }
        let tasks = result.payload.map((x) => this.getSingleTaskTree(organizationId, x));
        tasks = await Promise.all(tasks);

        for(let task of tasks){
            if(task.statusCode !== Errors.OK){
                return task;
            }
        }

        tasks = tasks.map((x) => x.payload);

        return new CustomResponse(Errors.OK, "", tasks);
    }

    /**
     * return a task tree starting from one task id
     * @param {number} taskId
     * @return {CustomResponse<TaskTree>}  
     */
    async getSingleTaskTree(organizationId, taskId){
        let task = await this.taskManager.readTask(organizationId, taskId);
        if(task.statusCode !== Errors.OK){
            return task;
        }
        /**
         * @type {Task}
         */
        task = task.payload;
        let taskTree = new TaskTree(task.taskId, task.taskName);

        for(let childTaskId of task.childTasks){
            let childTask = this.getSingleTaskTree(organizationId, childTaskId);
            taskTree.childTasks.push(childTask);
        }

        taskTree.childTasks = await Promise.all(taskTree.childTasks);

        for(let childTask of taskTree.childTasks){
            if(childTask.statusCode !== Errors.OK){
                return childTask;
            }
        }

        taskTree.childTasks = taskTree.childTasks.map((x) => x.payload);

        return new CustomResponse(Errors.OK, "", taskTree);
    }

    /**
     * returns the task with the given id
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} userId
     * @param {string} userToken
     * @returns {CustomResponse<Task>}
     */
    getTask(organizationId, taskId, userId, userToken){
        return this.taskManager.readTask(organizationId, taskId);
    }
}

const taskGetter = new TaskGetter();


exports.TaskGetter = TaskGetter;
exports.taskGetter = taskGetter;