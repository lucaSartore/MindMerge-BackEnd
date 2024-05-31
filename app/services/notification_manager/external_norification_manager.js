const { ServicesBaseClass } = require("../services_base_class");
const { CustomResponse } = require("../../common_infrastructure/response");
const { Errors } = require("../../common_infrastructure/errors.js");
const express = require('express');

var nodemailer = require('nodemailer'); //importing nodemailer

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST_SECRET,
    port: 587,
    auth: {
        user: process.env.EMAIL_ADDRESS_SECRET,
        pass: process.env.EMAIL_PASSWORD_SECRET
    }
});

const testingRouter = express.Router();

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
        console.log(r);
        if (r.statusCode != Errors.OK) {
            return r;
        }
        //send notification to user email
        let userEmail = r.payload.email;
        console.log(userEmail, notificationText);
        var mailOptions = {
            from: process.env.EMAIL_ADDRESS_SECRET,
            to: userEmail,
            subject: "MindMerge Notification",
            text: notificationText
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return new CustomResponse(Errors.BAD_REQUEST, "Email not sent");
            }
        });
        return new CustomResponse(Errors.OK, "Email sent to address " + userEmail);
    }
}

let external_norification_manager = new ExternalNotificationManager();

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

module.exports = { testingRouter, ExternalNotificationManager };
