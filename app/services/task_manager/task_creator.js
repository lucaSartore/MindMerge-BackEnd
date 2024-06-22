
const { Errors } = require('../../common_infrastructure/errors');
const {ServicesBaseClass} = require('../services_base_class');


/**
 * @typedef TaskCreator 
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class TaskCreator extends ServicesBaseClass{


    /**    
     * Create a new task in the database, the id of the task will be automatically generated
     * return the id of the task created
     * @param {number} organizationId
     * @param {Task} task
     * @param {number} userId
     * @param {string} userToken
     */
    async createTask(organizationId, task, userId, userToken){
        let response = await this.taskManager.createTask(organizationId,task)
        if(response.statusCode != Errors.OK){
            return response;
        }
        if (task.taskFatherId != undefined){
            let newTaskId = response.payload;
            return await this.taskManager.addChildTask(organizationId,task.taskFatherId,newTaskId);
        }
        return response;    
    }
    
    /**
     * Create new note to the task.
     * The note's date will be automatically set to the current time in the server
     * The note's id will be automatically generated
     * Return the id of the note created
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {string} notes 
     * @param {number} userId
     * @param {string} userToken
     * @returns {CustomResponse<number>}
     */
    createTaskNotes(organizationId, taskId, notes, userId, userToken){
    }

}

const taskCreator = new TaskCreator();
exports.taskCreator = taskCreator;