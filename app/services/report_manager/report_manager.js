const {ServicesBaseClass} = require('../services_base_class');
const {ReportType} = require('../../common_infrastructure/report_type.js');
const {CustomResponse} = require('../../common_infrastructure/response.js');
const {Errors} = require('../../common_infrastructure/errors.js');
const {AutomaticReportManager} = require('./automatic_report_manager.js');
const {ManualReportManager} = require('./manual_report_manager.js');
const {notificationManager} = require('../notification_manager/notification_manager.js');
const express = require('express');
const reportRouter = express.Router();
const {requestWrapper} = require('../../middleware/global_error_handler_middleware.js')


/**
 * @typedef ReportManager
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class ReportManager extends ServicesBaseClass{

    constructor(){
        super();
        this.automaticReportManager = new AutomaticReportManager();
        this.manualReportManager = new ManualReportManager();
    }

    /**
     * 
     * @param {number} organizationId 
     * @param {number} taskId 
     * @param {string} reportPrompt 
     * @param {number} reportType 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<string>}
     */
    async generateReport(organizationId, taskId, reportPrompt, reportType, userId, userToken){
        let report;
        if (reportType == ReportType.AUTOMATIC){
            let result = await this.automaticReportManager.generateAutomaticReports(organizationId, taskId, reportPrompt);
            if (result.statusCode !== Errors.OK){
                return result;
            }
            report = result.payload;
        }else{
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Not implemented", null);
        }
       
        console.log("Report generated: " + report);

        let result = await notificationManager.externalNotificationManager.sendNotification(userId, report);
        return result
    }
}

const reportManager = new ReportManager();

/**
  * @openapi
  * /api/v1/report/automatic:
  *     post:
  *         summary: Generate automatic report
  *         description: Generate automatic report for task, organization and user with the given prompt
  * 
  *         tags:
  *            - Reports
  * 
  *         parameters:
  *           - name: task_id
  *             description: The id of the task
  *             in: query
  *             required: true
  *             schema:
  *               type : integer
  *           - name: organization_id
  *             description: The id of the organization
  *             in: query
  *             required: true
  *             schema:
  *               type : integer
  *           - name: user_id
  *             description: The id of the user
  *             in: query
  *             required: true
  *             schema:
  *               type : integer
  *           - name: Token
  *             description: The jwt (json web token) of the user
  *             in: header
  *             required: true
  *             schema:
  *               type : string
  *         requestBody:
  *             name: Prompt
  *             description: The prompt for the report
  *             required: true
  *             content:
  *                application/json:
  *                   schema:      
  *                       type: object
  *                       properties:
  *                         prompt:
  *                            type : string
  *         responses:
  *             201:
  *                 description: Successfully creates the task note
  *                 content:
  *                     application/json:   
  *                         schema:
  *                             type: object
  *                             properties:
  *                                statusCode:
  *                                     type: integer
  *                                message:
  *                                     type: string
  *             400:
  *                 description: Bad request
  *             403:
  *                 description: Not authorized
  *             404:
  *                 description: Not found
  *             500:
  *                 description: Internal server error
  *         
  * 
  */

reportRouter.post('/automatic',requestWrapper( async (req, res) => {
    let organizationId = req.query.organization_id * 1;
    let userId = req.query.user_id * 1;
    let taskId = req.query.task_id * 1;
    let reportPrompt = req.body.prompt;
    
    let result = await reportManager.generateReport(organizationId, taskId, reportPrompt, ReportType.AUTOMATIC, userId, null);
    res.status(result.statusCode);
    res.json(result);
}));

exports.reportRouter = reportRouter;