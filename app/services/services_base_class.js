const {TaskManager} = require('../database_manager/task_manager.js');
const {OrganizationManager} = require('../database_manager/organization_manager.js');
const {UserManager} = require('../database_manager/user_manager.js');


/**
 * @typedef ServicesBaseClass
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 * 
 */
class ServicesBaseClass{
    constructor() {
        this.taskManager = new TaskManager(); 
        this.organizationManager = new OrganizationManager();
        this.userManager = new UserManager();
    }

    /**
     * verify that a user has a permission to do a particular action on a task 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} userId 
     * @param {string} userToken
     * @param {number} permission 
     * @returns {CustomResponse<bool>}
     */
    verifyTaskPermission(organizationId, taskId, userId, userToken, permission){
    }

    /**
     * verify that a user is really hwo they say they are, by comparing the token given to the token in the database
     * @param {number} userId 
     * @param {string} userToken
     * @returns {CustomResponse<bool>}
     */
    verifyAccount(userId, userToken){
    }


    /**
     * verify that a user has a permission to do a particular action on an organization 
     * @param {number} organizationId 
     * @param {number} userId 
     * @param {number} userToken 
     * @param {number} permission 
     */
    verifyOrganizationPermission(organizationId, userId, userToken, permission){
    }

}

exports.ServicesBaseClass = ServicesBaseClass;