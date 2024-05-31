const { ServicesBaseClass } = require("../services_base_class");
const { CustomResponse } = require("../../common_infrastructure/response");
const { Errors } = require("../../common_infrastructure/errors.js");
const express = require('express');

var nodemailer = require('nodemailer'); //importing nodemailer

const testingRouter = express.Router();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST_SECRET,
    port: 587,
    auth: {
        user: process.env.EMAIL_ADDRESS_SECRET,
        pass: process.env.EMAIL_PASSWORD_SECRET
    }
});

class ExternalNotificationManager extends ServicesBaseClass {

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
        let r = await this.userManager.readUser(userId);
        if (r.statusCode != Errors.OK) {
            return r;
        }
        //send notification to user email
        let userEmail = r.payload.email;
        var mailOptions = {
            from: process.env.EMAIL_ADDRESS_SECRET,
            to: userEmail,
            subject: "MindMerge Notification",
            text: notificationText
        };
        try {
            r = await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        reject(new CustomResponse(Errors.BAD_REQUEST, "Email not sent"));
                    } else {
                        resolve(new CustomResponse(Errors.OK, "Email sent to address " + userEmail));
                    }
                });
            });
            return r
        } catch (e) {
            return e;
        }
    }
}

let external_norification_manager = new ExternalNotificationManager();

if (process.env.NODE_ENV === 'development') {
    testingRouter.post('/externalNotification', async (req, res) => {
        let notificationId = req.body.notificationId;
        let userId = req.body.userId;
        let notificationText = req.body.notificationText;
        let date = Date.now();
        let read = false;
        let response = await external_norification_manager.sendNotification(notificationId, userId, notificationText, date, read);
        res.status(response.statusCode);
        res.json(response);
    });
}

module.exports = { testingRouter, ExternalNotificationManager };