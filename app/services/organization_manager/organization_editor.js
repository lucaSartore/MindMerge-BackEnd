const {CustomResponse} = require("../../common_infrastructure/response.js")
const {Errors} = require("../../common_infrastructure/errors.js")
const {ServicesBaseClass} = require("../services_base_class");
const express = require('express');

const organizationEditorRouter = express.Router();

class OrganizationEditor extends ServicesBaseClass{
    
    /** 
     * @param {number} organizationId 
     * @param {number} userToAddId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<void>}
     */
    async addUserToOrganization(organizationId, userToAddId, userId, userToken){
        return await this.organizationManager.addUserToOrganization(organizationId, userToAddId);
    }
    
    /** 
     * @param {number} organizationId 
     * @param {number} userToDeleteId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<void>}
     */
    async removeUserFromOrganization(organizationId, userToDeleteId ,userId, userToken){
        return await this.organizationManager.removeUserFromOrganization(organizationId, userToDeleteId);
    }
    

    /**
     * @param {number} organizationId
     * @returns {CustomResponse<Organization>}
     **/
    async getOrganization(organizationId){
        return await this.organizationManager.readOrganization(organizationId);
    }

    /**
     * @param {number} organizationId 
     * @returns {CustomResponse<string>}
     */
    async getOrganizationName(organizationId){
        let organization = await this.organizationManager.readOrganization(organizationId);
        if(organization.statusCode != Errors.OK){
            return organization;
        }
        return new CustomResponse(
            Errors.OK,
            "Success",
            organization.payload.organizationName
        )
    }


}

const organizationEditor = new OrganizationEditor();

organizationEditorRouter.post('/:organization_id/user/:user_id', async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    const userToAddId = req.params.user_id * 1;
    let response = await organizationEditor.addUserToOrganization(organizationId, userToAddId, undefined, undefined);
    res.status(response.statusCode)
    res.json(response);
});

organizationEditorRouter.delete('/:organization_id/user/:user_id', async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    const userToDeleteId = req.params.user_id * 1;
    let response =  await organizationEditor.removeUserFromOrganization(organizationId, userToDeleteId, undefined, undefined);
    res.status(response.statusCode)
    res.json(response);
});

organizationEditorRouter.get('/:organization_id', async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    let response =  await organizationEditor.getOrganization(organizationId);
    res.status(response.statusCode)
    res.json(response);
});

organizationEditorRouter.get('/:organization_id/name', async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    let response =  await organizationEditor.getOrganizationName(organizationId);
    res.status(response.statusCode)
    res.json(response);
});

module.exports = {organizationEditorRouter, OrganizationEditor};