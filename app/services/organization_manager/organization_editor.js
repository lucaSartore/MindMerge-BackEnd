const { CustomResponse } = require("../../common_infrastructure/response.js")
const { Errors } = require("../../common_infrastructure/errors.js")
const { ServicesBaseClass } = require("../services_base_class.js");
const express = require('express');
const { Organization } = require("../../common_infrastructure/organization.js");
const { requestWrapper } = require('../../middleware/global_error_handler_middleware.js')

const organizationEditorRouter = express.Router();

/**
 * @typedef OrganizationEditor
 * @type {Object}
 * @property {TaskManager} taskManager - The task manager class to edit the database
 * @property {OrganizationManager} organizationManager - The organization manager class to edit the database
 * @property {UserManager} userManager - The user manager class to edit the database
 */
class OrganizationEditor extends ServicesBaseClass{
    
    /** 
     * @param {number} organizationId 
     * @param {number} userToAddId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<void>}
     */
    async addUserToOrganization(organizationId, userToAddId, userId, userToken) {
        let r = await this.organizationManager.addUserToOrganization(organizationId, userToAddId);
        if (r.statusCode != Errors.OK) {
            return r;
        }
        return await this.userManager.addUserToOrganization(organizationId, userToAddId);
    }

    /** 
     * @param {number} organizationId 
     * @param {number} userToDeleteId 
     * @param {number} userId 
     * @param {number} userToken 
     * @returns {CustomResponse<void>}
     */
    async removeUserFromOrganization(organizationId, userToDeleteId, userId, userToken) {
        let r = await this.organizationManager.removeUserFromOrganization(organizationId, userToDeleteId);
        if (r.statusCode != Errors.OK) {
            return r;
        }
        return await this.userManager.removeUserFromOrganization(organizationId, userToDeleteId);
    }


    /**
     * @param {number} organizationId
     * @returns {CustomResponse<Organization>}
     **/
    async getOrganization(organizationId) {
        return await this.organizationManager.readOrganization(organizationId);
    }

    /**
     * @param {number} organizationId 
     * @returns {CustomResponse<string>}
     */
    async getOrganizationName(organizationId) {
        let organization = await this.organizationManager.readOrganization(organizationId);
        if (organization.statusCode != Errors.OK) {
            return organization;
        }
        return new CustomResponse(
            Errors.OK,
            "Success",
            organization.payload.organizationName
        )
    }


    /**
     * @param {number} organizationId
     * @returns {CustomResponse<{id: number, name: string}>}
    */
    async getOrganizationUsers(organizationId) {
        let organization = await this.organizationManager.readOrganization(organizationId);
        if (organization.statusCode != Errors.OK) {
            return organization;
        }
        let users = organization.payload.userIds.map(
            async (userId) => {

                return {
                    id: userId,
                    name: (await this.userManager.readUser(userId)).payload.userName
                }
            }
        )
        return new CustomResponse(
            Errors.OK,
            "Success",
            await Promise.all(users)
        )
    }

    /**
     * @param {Organization} organization // a json of a vaild organization
     * @returns {CustomResponse<void>}
     */
    async createOrganization(organization) {
        organization = Object.assign(new Organization(), organization);
        let user_ids = organization.userIds;
        organization.userIds = [];
        organization.licenseExpirationDate = new Date(organization.licenseExpirationDate);
        let result = await this.organizationManager.createOrganization(organization);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        for (let userId of user_ids) {
            let r = await this.addUserToOrganization(result.payload, userId);
            if (r.statusCode != Errors.OK) {
                return r;
            }
        }
        return result;
    }


}

const organizationEditor = new OrganizationEditor();

/**
  * @openapi
  * /api/v1/organization/{organization_id}/users:
  *     get:
  *         summary: Get all the users ids and names in an organization
  *         description: Get all the users ids and names in an organization
  *
  *         tags:
  *            - Organizations
  * 
  *         parameters:
  *             - name: organization_id
  *               description: The id of the organization
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully returns the users ids and names list
  *                 content:
  *                     application/json:   
  *                         schema:
  *                             type: object
  *                             properties:
  *                                statusCode:
  *                                     type: integer
  *                                message:
  *                                     type: string
  *                                payload: 
  *                                     type: array
  *                                     items:
  *                                         type: object
  *                                         properties:
  *                                            id: 
  *                                                 type: number
  *                                            name:
  *                                                 type: string      
  * 
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

organizationEditorRouter.get('/:organization_id/users', requestWrapper(async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    let response = await organizationEditor.getOrganizationUsers(organizationId);
    res.status(response.statusCode)
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/organization/{organization_id}/user/{user_id}:
  *     post:
  *         summary: Add an user to an organization
  *         description: Add the user with the given id to the organization with the given id
  *
  *         tags:
  *            - Organizations
  * 
  *         parameters:
  *             - name: organization_id
  *               description: The id of the organization
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: user_id
  *               description: The id of the user to add
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             201:
  *                 description: Successfully adds the user to the organization
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

organizationEditorRouter.post('/:organization_id/user/:user_id', requestWrapper(async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    const userToAddId = req.params.user_id * 1;
    let response = await organizationEditor.addUserToOrganization(organizationId, userToAddId, undefined, undefined);
    res.status(response.statusCode)
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/organization/{organization_id}/user/{user_id}:
  *     delete:
  *         summary: Remove an user from an organization
  *         description: Remove the user with the given id from the organization with the given id
  *
  *         tags:
  *            - Organizations
  * 
  *         parameters:
  *             - name: organization_id
  *               description: The id of the organization
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: user_id
  *               description: The id of the user to remove
  *               in: path
  *               required: true
  *               schema:
  *                  type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             204:
  *                 description: Successfully removes the user from the organization
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

organizationEditorRouter.delete('/:organization_id/user/:user_id', requestWrapper(async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    const userToDeleteId = req.params.user_id * 1;
    let response = await organizationEditor.removeUserFromOrganization(organizationId, userToDeleteId, undefined, undefined);
    res.status(response.statusCode)
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/organization/{organization_id}:
  *     get:
  *         summary: Get an organization
  *         description: Get an organization with the given id
  *
  *         tags:
  *            - Organizations
  * 
  *         parameters:
  *             - name: organization_id
  *               description: The id of the organization
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully returns the organization
  *                 content:
  *                     application/json:   
  *                         schema:
  *                             type: object
  *                             properties:
  *                                statusCode:
  *                                     type: integer
  *                                message:
  *                                     type: string
  *                                payload: 
  *                                     type: object
  *                                     $ref: '#/components/schemas/Organization'
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

organizationEditorRouter.get('/:organization_id', requestWrapper(async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    let response = await organizationEditor.getOrganization(organizationId);
    res.status(response.statusCode)
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/organization/:
  *     post:
  *         summary: Create an organization
  *         description: Create an organization with the given data
  *
  *         tags:
  *            - Organizations
  *  
  *         requestBody:
  *             name: organization
  *             description: The organization data
  *             required: true
  *             content:
  *                 application/json:   
  *                     schema:
  *                         type: object
  *                         $ref: '#/components/schemas/Organization'
  *         parameters:
  *           - name: Token
  *             description: The jwt (json web token) of the user
  *             in: header
  *             required: true
  *             schema:
  *               type : string
  * 
  *         responses:
  *             201:
  *                 description: Successfully creates the organization
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

organizationEditorRouter.post('/', requestWrapper(async (req, res) => {
    let response = await organizationEditor.createOrganization(req.body);
    console.log(req.body);
    res.status(response.statusCode)
    res.json(response);
}));

/**
  * @openapi
  * /api/v1/organization/{organization_id}/name:
  *     get:
  *         summary: Get the name of an organization
  *         description: Get the name of the organization with the given id
  *
  *         tags:
  *            - Organizations
  * 
  *         parameters:
  *             - name: organization_id
  *               description: The id of the organization
  *               in: path
  *               required: true
  *               schema:
  *                 type : integer
  *             - name: Token
  *               description: The jwt (json web token) of the user
  *               in: header
  *               required: true
  *               schema:
  *                 type : string
  *         responses:
  *             200:
  *                 description: Successfully returns the organization name
  *                 content:
  *                     application/json:   
  *                         schema:
  *                             type: object
  *                             properties:
  *                                statusCode:
  *                                     type: integer
  *                                message:
  *                                     type: string
  *                                payload: 
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

organizationEditorRouter.get('/:organization_id/name', requestWrapper(async (req, res) => {
    const organizationId = req.params.organization_id * 1;
    let response = await organizationEditor.getOrganizationName(organizationId);
    res.status(response.statusCode)
    res.json(response);
}));

module.exports = { organizationEditorRouter, OrganizationEditor };