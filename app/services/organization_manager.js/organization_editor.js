const ServicesBaseClass = require("../services_base_class");

export default class OrganizationEditor extends ServicesBaseClass{
    
    /** 
     * @param {number} organizationId 
     * @param {number} userToAddId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<void>}
     */
    addUserToOrganization(organizationId, userToDeleteId, userId, userToken){
    }
    
    /** 
     * @param {number} organizationId 
     * @param {number} userToDeleteId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<void>}
     */
    removeUserFromOrganization(organizationId, userToAddId, userId, userToken){
    }

}