import ServicesBaseClass from "../services_base_class";

export default class ExternalNotificationManager extends ServicesBaseClass{
    
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