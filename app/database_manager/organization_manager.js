const {DataBaseManager, OrganizationModel, UserModel} = require('./database_manager.js');

const {CustomResponse} = require('../common_infrastructure/response.js');
const {Errors} = require('../common_infrastructure/errors.js');

class OrganizationManager extends DataBaseManager{

    //////////////////////////// Creation ////////////////////////////

    /**
     * Create a new organization in the database, the id of the organization will be automatically generated
     * return the id of the organization created
     * @param {Organization} organization 
     * @returns {CustomResponse<number>}
     */
    async createOrganization(organization){
        if(!organization.validate()){
            console.log("Organization NOT created");
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid organization")
        }
        let new_organization = new OrganizationModel(organization);
        await new_organization.save();
    }

    //////////////////////////// Updating ////////////////////////////

    /**
     * Update the name of the organization with the given id to the new name that is passed
     * this function will also edit the profile of the user to add the organization to the user's profile
     * @param {number} organizationId
     * @param {string} newName
     * @returns {CustomResponse<number>}
    */
    async addUserToOrganization(organizationId, userId){
        if(organizationId == undefined || typeof organizationId != "number"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if(userId == undefined || typeof userId != "number"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid User Id");
        }
        let organization = await OrganizationModel.findOne({organizationId: organizationId});
        let user = await UserModel.findOne({userId: userId});
        if(organization == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Organization not found");
        }
        if(user == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "User not found");
        }
        organization.userIds.push(userId);
        user.organizations.push(organizationId);
        return new CustomResponse(Errors.OK, "User added to organization", userId);
    }

    /**
     * Update the license of the organization with the given id to the new license that is passed
     * @param {number} organizationId
     * @param {boolean} newLicense
     * @returns {CustomResponse<boolean>}
     */
    async updateLicense(organizationId, newLicense){
        if(organizationId == undefined || typeof organizationId != "number"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if(newLicense == undefined || typeof newLicense != "boolean"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid License");
        }
        let organization = await OrganizationModel.findOne({OrganizationId: organizationId});
        if(organization == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Organization not found");
        }
        organization.licenseValid = newLicense;
        return new CustomResponse(Errors.OK, "License updated", organization.licenseValid);
    }

    /**
     * Update the license expiration date of the organization with the given id to the new date that is passed
     * @param {number} organizationId
     * @param {Date} newDate
     * @returns {CustomResponse<Date>}
     */
    async updateLicenseExpirationDate(organizationId, newDate){
        if(organizationId == undefined || typeof organizationId != "number"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if(newDate == undefined || typeof newDate != "Date"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Date");
        }
        let organization = await OrganizationModel.findOne({OrganizationId: organizationId});
        if(organization == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Organization not found");
        }
        organization.licenseExpirationDate = newDate;
        return new CustomResponse(Errors.OK, "License expiration date updated", organization.licenseExpirationDate);
    }

    //////////////////////////// Deleting ////////////////////////////

    /**
     * Delete the organization with the given id 
     * @param {number} organizationId 
     * @returns {CustomResponse<void>}
     */
    deleteOrganization(organizationId){
    }

    /**
     * Remove a user from an organization
     * Can return an error if the user is the owner of the organization
     * This function will also update the profile of the user remove the organization from the user's profile
     * @param {number} organizationId
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */

    async removeUserFromOrganization(organizationId, userId){
        if(organizationId == undefined || typeof organizationId != "number"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if(userId == undefined || typeof userId != "number"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid User Id");
        }
        let organization = await OrganizationModel.findOne({organizationId: organizationId});
        let user = await UserModel.findOne({userId: userId});
        if(organization == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Organization not found");
        }
        if(user == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "User not found");
        }
        if(organization.ownerId == userId){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Cannot remove owner from organization");
        }
        organization.userIds = organization.userIds.filter(id => id != userId);
        user.organizations = user.organizations.filter(id => id != organizationId);
        return new CustomResponse(Errors.OK, "User removed from organization", userId);
    }

    //////////////////////////// Reading ///////////////////////////

    /**
     * Return one single organization
     * @param {number} organizationId 
     * @returns {CustomResponse<Organization>}
     */
    readOrganization(organizationId){
    }
}

exports.OrganizationManager = OrganizationManager;