const { ServicesBaseClass } = require("../services_base_class");

/**
 * @typedef InternalNotificationManager
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class InternalNotificationManager extends ServicesBaseClass{

    /**
     * 
     * @param {number} notificationId 
     * @param {number} userId 
     * @param {number} userToken
     * @returns {CustomResponse<void>}
     */
    deleteNotification(notificationId, userId, userToken){
    }

    /**
     * 
     * @param {number} notificationId 
     * @param {number} userId 
     * @param {number} userToken
     * @returns {CustomResponse<void>}
     */
    markNotificationAsRead(notificationId, userId, userToken){
    }

    /**
     * 
     * @param {number} notificationId 
     * @param {number} userId 
     * @param {number} userToken
     * @returns {CistomRespomse<Notification>}
     */
    getNotificationDetails(notificationId, userId, userToken){
    }

    /** 
     * @param {number} userId 
     * @param {number} userToken
     * @returns {CustomResponse<Notification[]>}
     */
    getNotificationList(userId, userToken){
    }
}

exports.InternalNotificationManager = InternalNotificationManager;