import ServicesBaseClass from '../services_base_class.js';

export default class InternalNotificationManager extends ServicesBaseClass{

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