const {ServicesBaseClass} = require('../services_base_class');
const { TaskTree } = require('../../common_infrastructure/task_tree.js');
//import { CustomResponse } from '../../common_infrastructure/response.js';
//import { taskGetter } from './task_getter';

class TaskEditor extends ServicesBaseClass{

    /**
     * Delete the task with the specify ID, and all the sub tasks.
     * @param {number} organizationId 
     * @param {number} taskId 
     * @param {number} userId 
     * @param {string} userToken 
     * @return {CustomResponse<void>}
     */
    deleteTask(organizationId, taskId, userId, userToken){
        taskGetter.getSingleTaskTree(organizationId,taskId);

    }

    /**
     * delete a task tree recursively
     * @param {TaskTree} tree 
     * @returns {CustomResponse<void>}
     */
    deleteTaskTree(tree){
        let r = this.taskManager.deleteTask()
        
    }


    /**
     * Delete the assignee with the given id from the task with the given id
     * Can return an error if you are trying to delete the last assignee of the task
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} assigneeId
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    async deleteTaskAssignee(organizationId, taskId, assigneeId, userId, userToken){
        return await this.taskManager.deleteTaskAssignee(organizationId,taskId,assigneeId)
    } 

    
    /**
     * Delete the note with the given id from the task with the given id
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} noteId
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    deleteTaskNotes(organizationId, taskId, noteId, userId, userToken){
        return this.taskManager.deleteTaskNotes(organizationId,taskId,noteId);
    }

    /**
     * Update the task with the given id with the new task that is passed
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {Task} newTask 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {Response}
     */
    updateTask(organizationId, taskId, newTask, userId, userToken){
    }
    /**
     * Create a new note for the task with the given id
     * @param {number} organizationId 
     * @param {number} taskId 
     * @param {string} notes 
     * @returns 
     */
    async createTaskNotes(organizationId, taskId, notes){
        return await this.taskManager.createTaskNotes(organizationId,taskId,notes);
    }

    /**
     * Update the name of the task with the given id to the new name that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {string} newName
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    async updateTaskName(organizationId, taskId, newName, userId, userToken){
        return await this.taskManager.updateTaskName(organizationId,taskId,newName)
    }

    /**
     * Update the description of the task with the given id to the new description that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {string} newDescription
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    updateTaskDescription(organizationId, taskId, newDescription, userId, userToken){
    }

    /**
     * Update the status of the task with the given id to the new status that is passed 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} newStatus 
     * @param {number} userId 
     * @param {string} userToken 
     */
    updateTaskStatus(organizationId, taskId, newStatus, userId, userToken){
    }

    /**
     * Update the notes of a task.
     * The note's date will be automatically set to the current time in the server 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} noteId 
     * @param {string} newNotes 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    async updateTaskNotes(organizationId, taskId, noteId, newNotes, userId, userToken){
        return await this.taskManager.updateTaskNotes(organizationId,taskId,noteId,newNotes);
    }

    /**
     * Update the assignees of the task with the given id to the new assignees that are passed 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number[]} assignees 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    updateTaskAssignees(organizationId, taskId, assignees, userId, userToken){
    }

    /**
     * Add a new assignee to the task, if it doesn't exist already
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} assignee 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    async addNewAssignee(organizationId, taskId, assignee, userId, userToken){
        return await this.taskManager.addNewAssignee(organizationId,taskId,assignee)
    }

    /**
     * Update the manager of the task with the given id to the new manager that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} newManager
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    updateTaskManager(organizationId, taskId, newManager, userId, userToken){
    }

    /**
     * Enable the notifications for the task with the given id 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    enableNotification(organizationId, taskId, userId, userToken){
    }
    
    /**
     * Disable the notifications for the task with the given id 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    disableNotification(organizationId, taskId, userId, userToken){
    }

    /**
     * Update the recursive permissions value of the task with the given id to the new value that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} newRecursivePermissionsValue
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
    */
    updateTaskRecursivePermissionsValue(organizationId, taskId, newRecursivePermissionsValue, userId, userToken){}
}


const taskEditor = new TaskEditor();
exports.taskEditor = taskEditor;