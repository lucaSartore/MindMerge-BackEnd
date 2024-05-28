const ServicesBaseClass = require("../services_base_class");
const {CustomResponse} = require("../../common_infrastructure/response");
const {Errors} = require("../../common_infrastructure/errors");
const {Notification} = require("../../common_infrastructure/notification");
const express = require('express');
const {ServicesBaseClass} = require("../services_base_class.js");

const externalNotificationManagerRouter = express.Router();

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
    async sendNotification(notificationId, userId, notificationText, date, read){
        let notification = new Notification(notificationId, userId, notificationText, date, read);
        if(!notification.validate()){
            return new CustomResponse(Errors.INVALID_DATA);
        }
        return await this.userManager.createNotification(notification.userId, notification);
    }
}

const externalNotificationManager = new ExternalNotificationManager();
externalNotificationManagerRouter.post('/sendNotification', async (req, res) => {
    let notificationId = req.body.notificationId;
    let userId = req.body.userId;
    let notificationText = req.body.notificationText;
    let date = req.body.date;
    let read = req.body.read;
    let response = await externalNotificationManager.sendNotification(notificationId, userId, notificationText, date, read);
    res.status(response.statusCode).send(response);
});