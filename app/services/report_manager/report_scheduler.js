const ServicesBaseClass = require('../services_base_class');

/**
 * @typedef default
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class reportScheduler extends ServicesBaseClass{
    /**
     * 
     * @param {number} organizationId 
     * @param {number} taskId 
     * @param {string} reportPrompt 
     * @param {number} reportKind 
     * @param {number} reportFrequency 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<void>}
     */
    scheduleReport(organizationId, taskId, reportPrompt, reportKind, reportFrequency, userId, userToken){
    }

    /**
     * return a list of all the report schedules for a task
     * @param {number} organizationId 
     * @param {number} taskId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<TaskReportSchedule[]>}
     */
    getReportSchedules(organizationId, taskId, userId, userToken){
    }

    /**
     * delete a report schedule
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} reportId
     * @param {number} userId
     * @param {string} userToken
     * @returns {CustomResponse<void>}
     */
    deleteReportSchedule(organizationId, taskId, reportId, userId, userToken){
    }

    /**
     * Execute all the pending report for one organization
     * @param {number} organizationId 
     */
    executeScheduledReport(organizationId){
    }
}
exports.reportScheduler = reportScheduler;