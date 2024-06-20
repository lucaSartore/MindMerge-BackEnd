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


class ReportManager extends ServicesBaseClass{

    constructor(){
        super();
        this.automaticReportManager = new AutomaticReportManager();
        this.manualReportManager = new ManualReportManager();
    }

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