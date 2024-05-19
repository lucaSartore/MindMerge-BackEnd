const ServicesBaseClass = require('../services_base_class');

export default class ReportManager extends ServicesBaseClass{

    constructor(){
        super();
        this.automaticReportManager = new AutomaticReportManager();
        this.manualReportManager = new ManualReportManager();
    }

    generateReport(organizationId, taskId, reportPrompt, reportKind, userId, userToken){
    }
}