const { ServicesBaseClass } = require("../services_base_class");
const {ExternalNotificationManager} = require('./external_notification_manager');
const {InternalNotificationManager} = require('./internal_notification_manager');


/**
 * @typedef NotificationManager
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class NotificationManager extends ServicesBaseClass{

    constructor(){
        super();
        this.externalNotificationManager = new ExternalNotificationManager();
        this.internalNotificationManager = new InternalNotificationManager();
    }

    /**
     * 
     * @param {number} notificationId 
     * @param {number} userId 
     * @param {string} notificationText 
     * @param {Date} date 
     * @param {boolean} read 
     * @returns {CustomResponse<void>}
     */
    sendNotification(notificationId, userId, notificationText, date, read){
        return this.externalNotificationManager.sendNotification(notificationId, userId, notificationText, date, read);
        // this.internalNotificationManager.sendNotification(notificationId, userId, notificationText, date, read);
    }
}
const notificationManager = new NotificationManager();

exports.NotificationManager = NotificationManager;
exports.notificationManager = notificationManager;