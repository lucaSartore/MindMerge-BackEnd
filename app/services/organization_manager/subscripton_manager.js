const ServicesBaseClass = require("../services_base_class");

export default class OrganizationSubscriptionManager extends ServicesBaseClass{

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