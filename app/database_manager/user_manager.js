const mongoose = require("mongoose");
const { DataBaseManager, UserModel } = require('./database_manager.js');
const {User} = require("../common_infrastructure/user.js");
const {CustomResponse} = require("../common_infrastructure/response.js");
const {Errors} = require('../common_infrastructure/errors.js');

class UserManager extends DataBaseManager{

    //////////////////////////// Creation ////////////////////////////

    /**
     * Create a new user in the database, the id of the user will be automatically generated
     * return the id of the user created
     * @param {User} user 
     * @returns {CustomResponse<number>}
     */
    async createUser(user) {
        try {
            if (!user.validate()) {
                return new CustomResponse(Errors.BAD_REQUEST, null, "Invalid user");
            }
            
            const newUser = new UserModel(user);
            await newUser.save();
            
            return new CustomResponse(Errors.OK, newUser.userId, "User created successfully");
        } catch (error) {
            console.error("Error while creating user:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, null, "Failed to create user");
        }
    }


    /**
     * Create a new notification in the database, the id of the notification will be automatically generated 
     * return the id of the notification created
     * @param {number} userId 
     * @param {Notification} notification
     * @returns {CustomResponse<number>}
     */
    createNotification(userId, notification){
    }

    //////////////////////////// Updating ////////////////////////////

    /**
     * Update the name of the user with the given id to the new name that is passed
     * @param {number} userId
     * @param {string} newName
     * @returns {CustomResponse<void>}
     */
    updateUserName(userId, newName){
    }

    /**
     * Add a user to an organization
     * @param {number} organizationId
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    addUserToOrganization(organizationId, userId){
    }

    /**
     * Mark a notification as read 
     * @param {number} userId 
     * @param {number} notificationId 
     * @returns {CustomResponse<void>}
     */
    markNotificationAsRead(userId, notificationId){
    }


    //////////////////////////// Deleting ////////////////////////////

    /**
     * Delete the user with the given id 
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    deleteUser(userId){
    }
    

    /**
     * Remove a user from an organization
     * @param {number} organizationId
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    removeUserFromOrganization(organizationId, userId){
    }


    /**
     * Delete the notification with the given id 
     * @param {number} userId 
     * @param {number} notificationId 
     * @returns {CustomResponse<void>}
     */
    deleteNotification(userId, notificationId){
    }

    //////////////////////////// Reading ///////////////////////////
    /**
     * Return one single user
     * @param {number} userId
     * @returns {CustomResponse<User>}
     */

async readUser(userId) {
    try {
        const user = await UserModel.findOne({ userId: userId }).exec(); 
        if (user) {
            return new CustomResponse(Errors.OK, user, "User found");
        } else {
            return new CustomResponse(Errors.NOT_FOUND, null, "User not found");
        }
    } catch (error) {
        console.error("Error while searching for user:", error);
        return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, null, "Failed to fetch user");
    }
}

    /**
     * Return a list of all the notifications that the user has 
     * @param {number} userId 
     * @returns {CustomResponse<Notification[]>}
     */
    readUserNotifications(userId){
    }

    ////////////////////////// Authentication ////////////////////////

    /**
     * @param {number} userId
     * @param {CustomUserInfo} customUserInfo
     * @returns {CustomResponse<number>}
    */
    createCustomUserInfo(userId, customUserInfo){
    }

    /**
     * @param {number} userId 
     * @param {FacebookUserInfo} facebookUserInfo 
     * @returns {CustomResponse<number>}
     */
    createFacebookUserInfo(userId, facebookUserInfo){
    }

    /**
     * @param {number} userId 
     * @param {GoogleUserInfo} googleUserInfo 
     * @returns {CustomResponse<number>}
     */
    createGoogleUserInfo(userId, googleUserInfo){
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<CustomUserInfo>}
     */
    readCustomUserInfo(userId){
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<FacebookUserInfo>}
     */
    readFacebookUserInfo(userId){
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<GoogleUserInfo>}
     */
    readGoogleUserInfo(userId){
    }

    /**
     * @param {number} userId 
     * @param {CustomUserInfo} newCustomUserInfo 
     * @returns {CustomResponse<void>}
     */
    updateCustomUserInfo(userId, newCustomUserInfo){
    }
    
    /**
     * @param {number} userId 
     * @param {FacebookUserInfo} newFacebookUserInfo 
     * @returns {CustomResponse<void>}
     */
    updateFacebookUserInfo(userId, newFacebookUserInfo){
    }

    /**
     * @param {number} userId 
     * @param {GoogleUserInfo} newGoogleUserInfo 
     * @returns {CustomResponse<void>}
     */
    updateGoogleUserInfo(userId, newGoogleUserInfo){
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    deleteCustomUserInfo(userId){
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    deleteFacebookUserInfo(userId){
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    deleteGoogleUserInfo(userId){
    }
}

exports.UserManager = UserManager;