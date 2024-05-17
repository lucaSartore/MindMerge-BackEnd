const mongoose = require("mongoose");
const { DataBaseManager, UserModel, NotificationModel } = require('./database_manager.js');
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
                return new CustomResponse(Errors.BAD_REQUEST, "Invalid user", null);
            }

            const existingUser = await UserModel.findOne({ userName: user.userName });
            if (existingUser) {
                return new CustomResponse(Errors.BAD_REQUEST, "Username already exists", null);
            }
            
            const newUser = new UserModel(user);
            await newUser.save();
            
            return new CustomResponse(Errors.OK, "User created successfully", newUser);
        } catch (error) {
            console.error("Error while creating user:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to create user", null);
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
    async updateUserName(userId, newName) {
        try {
            const user = await UserModel.findOneAndUpdate(
                { userId: userId },
                { userName: newName },
                { new: true }
            );

            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            return new CustomResponse(Errors.OK, "User name updated successfully", null);
        } catch (error) {
            console.error("Error while updating user name:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to update user name", null);
        }
    }

    /**
    * Add a user to an organization
    * @param {number} organizationId
    * @param {number} userId 
    * @returns {CustomResponse<void>}
    */
    async addUserToOrganization(organizationId, userId) {
        try {
            const organization = await OrganizationModel.findOne({ organizationId: organizationId });
            if (!organization) {
                return new CustomResponse(Errors.NOT_FOUND, "Organization not found", null);
            }

            const user = await UserModel.findOne({ userId: userId });
            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            organization.userIds.push(userId);
            await organization.save();

            return new CustomResponse(Errors.OK, "User added to organization successfully", null);
        } catch (error) {
            console.error("Error while adding user to organization:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to add user to organization", null);
        }
    }

    /**
    * Mark a notification as read 
    * @param {number} userId 
    * @param {number} notificationId 
    * @returns {CustomResponse<void>}
    */
    async markNotificationAsRead(userId, notificationId) {
        try {
            const user = await UserModel.findOne({ userId: userId });
            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            const notification = user.notifications.id(notificationId);
            if (!notification) {
                return new CustomResponse(Errors.NOT_FOUND, "Notification not found", null);
            }

            notification.read = true;
            await user.save();

            return new CustomResponse(Errors.OK, "Notification marked as read", null);
        } catch (error) {
            console.error("Error while marking notification as read:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to mark notification as read", null);
        }
    }


    //////////////////////////// Deleting ////////////////////////////

    /**
    * Delete the user with the given id 
    * @param {number} userId 
    * @returns {CustomResponse<void>}
    */
    async deleteUser(userId) {
        try {
            const user = await UserModel.findOneAndDelete({ userId: userId });
            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            return new CustomResponse(Errors.OK, "User deleted successfully", null);
        } catch (error) {
            console.error("Error while deleting user:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to delete user", null);
        }
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
                return new CustomResponse(Errors.OK, "User found", user);
            } else {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }
        } catch (error) {
            console.error("Error while searching for user:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to fetch user", null);
        }
    }

    /**
     * Return every user
     * @returns {CustomResponse<User[]}
     */
    async readAllUsers() {
        try {
            const users = await UserModel.find();
            if (users) {
                return new CustomResponse(Errors.OK, "ciao", users);
            } else {
                return new CustomResponse(Errors.NOT_FOUND, "rip", null);
            }
        } catch (error) {
            console.error("Error while searching for users:", error);
            return new CustomResponse(Error.INTERNAL_SERVER_ERROR, "Failed to fetch users", null);
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

