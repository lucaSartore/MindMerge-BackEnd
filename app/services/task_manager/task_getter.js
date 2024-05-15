const ServicesBaseClass = require('../services_base_class');

export default class TaskGetter extends ServicesBaseClass{
    
    /**
     * returns the task trees a user can see inside an organization 
     * @param {number} organizationId 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<TaskTree[]>}
     */
    getTasksForUser(organizationId, userId, userToken){
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
    }
}