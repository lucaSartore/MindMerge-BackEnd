const ServicesBaseClass = require("../services_base_class");

/**
 * @typedef default
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class OrganizationSubscriptionManager extends ServicesBaseClass{

    /**
     * @param {number} organizationId
     * @returns {CustomResponse<number>}
     */
    calculateSubscriptionPrice(organizationId){
    }

    /**
     * 
     * @param {number} organizationId 
     * @param {number} userId 
     * @param {string} userToken 
     * @param {string} paymentInfo 
     */
    paySubscription(organizationId, userId, userToken, paymentInfo){
    }

    /**
     * returns true if the organization has a valid subscription
     * @param {number} organizationId
     * @returns {CustomResponse<bool>}
     */
    verifySubscription(organizationId){
    }
}

exports.OrganizationSubscriptionManager = OrganizationSubscriptionManager;