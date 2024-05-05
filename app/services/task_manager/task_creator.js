import ServicesBaseClass from '../services_base_class';

export default class TaskCreator extends ServicesBaseClass{


    /*    
     * Create a new task in the database, the id of the task will be automatically generated
     * return the id of the task created
     * @param {number} organizationId
     * @param {Task} task
     * @param {number} userId
     * @param {string} userToken
     */
    createTask(organizationId, task, userId, userToken){
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