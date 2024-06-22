const {DataBaseManager, OrganizationModel } = require('./database_manager.js');
const { Organization } = require('../common_infrastructure/organization.js');
const {CustomResponse} = require('../common_infrastructure/response.js');
const {Errors} = require('../common_infrastructure/errors.js');

/**
 * @typedef OrganizationManager
 * @type {Object}
 * @property {mongoose} mongoose - The mongoose object
 */
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
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid organization")
        }
        let new_organization = new OrganizationModel(organization);
        await new_organization.save();
        return new CustomResponse(Errors.OK, "Organization created", new_organization.organizationId);
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

        let result = await this.validateOrganization(organizationId);
        if(result.statusCode != Errors.OK){
            return result;
        }

        if(userId == undefined || typeof userId != "number" || isNaN(userId) ){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid User Id");
        }

        let organization = await OrganizationModel.findOne({organizationId: organizationId});
        if(organization.userIds.includes(userId)){
            return new CustomResponse(Errors.BAD_REQUEST, false, "User already in organization");
        }
            
        await OrganizationModel.findOneAndUpdate({organizationId: organizationId}, {$push: {userIds: userId}});
        return new CustomResponse(Errors.OK, "", null);
    } 
        

    /**
     * Update the license of the organization with the given id to the new license that is passed
     * @param {number} organizationId
     * @param {boolean} newLicense
     * @returns {CustomResponse<void>}
     */
    async updateLicense(organizationId, newLicense){

        let result = await this.validateOrganization(organizationId);
        if(result.statusCode != Errors.OK){
            return result;
        }

        if(newLicense == undefined || typeof newLicense != "boolean"){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid License");
        }


        await OrganizationModel.findOneAndUpdate({organizationId: organizationId}, {licenseValid: newLicense})

        return new CustomResponse(Errors.OK, "License updated", undefined);
    }

    /**
     * Update the license expiration date of the organization with the given id to the new date that is passed
     * @param {number} organizationId
     * @param {Date} newDate
     * @returns {CustomResponse<Date>}
     */
    async updateLicenseExpirationDate(organizationId, newDate){

        let result = await this.validateOrganization(organizationId);
        if(result.statusCode != Errors.OK){
            return result;
        }

        if( typeof newDate != 'object' || ! newDate instanceof Date){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Date");
        }

        await OrganizationModel.findOneAndUpdate({organizationId: organizationId}, {licenseExpirationDate: newDate});

        return new CustomResponse(Errors.OK, "License expiration date updated", newDate);
    }

    //////////////////////////// Deleting ////////////////////////////

    /**
     * Delete the organization with the given id 
     * @param {number} organizationId 
     * @returns {CustomResponse<number>}
     */
    async deleteOrganization(organizationId){

        // not necessary for MVP

        // let result = await this.validateOrganization(organizationId);
        // if(result.statusCode != Errors.OK){
        //     return result;
        // }

        // if(organizationId == undefined || typeof organizationId != "number" || isNaN(organizationId) ){
        //     return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        // }
        // let organization = await OrganizationModel.findOne({OrganizationId: organizationId});
        // if(organization == null){
        //     return new CustomResponse(Errors.BAD_REQUEST, false, "Organization not found");
        // }
        // OrganizationModel.deleteOne({organizationId: organizationId});
        // return new CustomResponse(Errors.OK, "Organization deleted", organizationId);
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

        if(organizationId == undefined || typeof organizationId != "number" || isNaN(organizationId) ){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if(userId == undefined || typeof userId != "number" || isNaN(userId) ){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid User Id");
        }
        let organization = await OrganizationModel.findOne({organizationId: organizationId});
        if(organization == null){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Organization not found");
        }

        if(organization.ownerId == userId){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Cannot remove owner from organization");
        }

        if(organization.userIds.find((x) => x == userId) == undefined){
            return new CustomResponse(Errors.BAD_REQUEST, false, "User not in organization");
        }

        await OrganizationModel.findOneAndUpdate({organizationId: organizationId}, { $pull: { userIds: userId} });
        
        return new CustomResponse(Errors.OK, "User removed from organization", userId);
    }

    //////////////////////////// Reading ///////////////////////////

    /**
     * Return one single organization
     * @param {number} organizationId 
     * @returns {CustomResponse<Organization>}
     */
    async readOrganization(organizationId){
        
        if(typeof organizationId != "number" || isNaN(organizationId) ){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }

        let result = await this.validateOrganization(organizationId);
        if(result.statusCode != Errors.OK){
            return result;
        }

        let organization = await OrganizationModel.findOne({organizationId: organizationId});
        organization = new Organization(organization.organizationId, organization.organizationName, organization.userIds, organization.licenseValid, organization.licenseExpirationDate, organization.ownerId)
        
        return new CustomResponse(Errors.OK, "", organization);
    }

    /**
     * Return whether an organization is valid or not
     * @param {number} organizationId
     * @returns {CustomResponse<void>}
     * */
    async validateOrganization(organizationId){
        if (organizationId == undefined || typeof organizationId != "number" || isNaN(organizationId) ){
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        let organization = await OrganizationModel.findOne({organizationId: organizationId});
        if(organization == null){
            return new CustomResponse(Errors.NOT_FOUND, false, "Organization not found");
        }
        return new CustomResponse(Errors.OK,"", undefined);
    }
}

exports.OrganizationManager = OrganizationManager;
