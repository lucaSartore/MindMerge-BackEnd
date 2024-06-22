const {ServicesBaseClass} = require("../services_base_class");

/**
 * @typedef ManualReportManager
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class ManualReportManager extends ServicesBaseClass{
    generateManualReports(organizationId, taskId, reportPrompt){
    }
}
exports.ManualReportManager = ManualReportManager;
