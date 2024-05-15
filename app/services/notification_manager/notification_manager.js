const ServicesBaseClass = require('../services_base_class');

export default class NotificationManager extends ServicesBaseClass{

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
    }
}