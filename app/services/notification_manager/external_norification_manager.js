const ServicesBaseClass = require("../services_base_class");
const {CustomResponse} = require("../../common_infrastructure/response");
const {Errors} = require("../../common_infrastructure/errors");
const {ServicesBaseClass} = require("../services_base_class.js");

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
    async sendNotification(notificationId, userId, notificationText, date, read) {
        let user = this.usermanager.readUser(userId);
        if (user.statusCode != Errors.OK) {
            return user;
        }
        //send notification to user email
        let userEmail = user.payload.email;
        console.log(userEmail, notificationText, date, read);
    }
}

