const mongoose = require("mongoose");
const { DataBaseManager, UserModel, NotificationModel } = require('./database_manager.js');
const {User} = require("../common_infrastructure/user.js");
const {CustomResponse} = require("../common_infrastructure/response.js");
const {Errors} = require('../common_infrastructure/errors.js');
const { Notification } = require("../common_infrastructure/notification.js");

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
            
            const existingUserMail = await UserModel.findOne({ email: user.email });
            if (existingUserMail) {
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
    async createNotification(userId, notification) {
        try {

            if (typeof userId != "number" || userId == 0) {
                return new CustomResponse(Errors.BAD_REQUEST, "Invalid userId", null);
            }

            notification.userId = userId;

            if (notification == undefined || notification.validate == undefined || !notification.validate()) {
                return new CustomResponse(Errors.BAD_REQUEST, "Invalid notification", null);
            }

            const user = await UserModel.findOne({ userId: userId });
            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            const newNotification = new NotificationModel(notification);
            await newNotification.save();

            return new CustomResponse(Errors.OK, "Notification created successfully", notification);
        } catch (error) {
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to add notification", null);
        }
    }


    //////////////////////////// Updating ////////////////////////////

    /**
    * Update the name of the user with the given id to the new name that is passed
    * @param {number} userId
    * @param {string} newName
    * @returns {CustomResponse<void>}
    */
    async updateUserName(userId, newName) {
        if (typeof newName != "string" || newName == "") {
            return new CustomResponse(Errors.BAD_REQUEST, "New username invalid", null);
        }

        try {
            const existingUser = await UserModel.findOne({ userName: newName });

            if (existingUser) {
                return new CustomResponse(Errors.BAD_REQUEST, "User with the provided username already exists", null);
            }

            const user = await UserModel.findOneAndUpdate(
                { userId: userId },
                { userName: newName },
                { new: true }
            );

            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            return new CustomResponse(Errors.OK, "User name updated successfully", user);
        } catch (error) {
            console.error("Error while updating user name:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to update user name", null);
        }
    }

    /**
    * Update the kind of the user with the given id to the new kind that is passed
    * @param {number} userId
    * @param {userKind} newUserKind
    * @returns {CustomResponse<void>}
    */
    async updateUserKind(userId, newUserKind) {
    try {
        
        if(typeof newUserKind != "number" || newUserKind <= 0 || newUserKind > 3) {
            return new CustomResponse(Errors.BAD_REQUEST, "New user kind invalid", null);
        }

        const user = await UserModel.findOneAndUpdate(
            { userId: userId },
            { userKind: newUserKind },
            { new: true }
        );

        if (!user) {
            return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
        }

        return new CustomResponse(Errors.OK, "User kind updated successfully", user);
    } catch (error) {
        console.error("Error while updating user kind:", error);
        return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to update user kind", null);
    }
}

    /**
    * Update the mail of the user with the given id to the new mail that is passed
    * @param {number} userId
    * @param {userKind} newUserMail
    * @returns {CustomResponse<void>}
    */
    async updateUserEmail(userId, newEmail) {
        if (typeof newEmail != "string" || newEmail == "") {
            return new CustomResponse(Errors.BAD_REQUEST, "New username invalid", null);
        }

        try {
            const existingUser = await UserModel.findOne({ email: newEmail });

            if (existingUser) {
                return new CustomResponse(Errors.BAD_REQUEST, "User with the provided email already exists", null);
            }

            const user = await UserModel.findOneAndUpdate(
                { userId: userId },
                { email: newEmail },
                { new: true }
            );

            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
            }

            return new CustomResponse(Errors.OK, "User email updated successfully", user);
        } catch (error) {
            console.error("Error while updating user email:", error);
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to update user email", null);
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
            const notification = await NotificationModel.findOneAndUpdate(
                { userId: userId, notificationId: notificationId },
                { read: true },
                { new: true }
            );

            if (!notification) {
                return new CustomResponse(Errors.NOT_FOUND, "Notification not found", null);
            }

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
        // not necessary for MVP

        // try {
        //     const user = await UserModel.findOneAndDelete({ userId: userId });
        //     if (!user) {
        //         return new CustomResponse(Errors.NOT_FOUND, "User not found", null);
        //     }

        //     return new CustomResponse(Errors.OK, "User deleted successfully", null);
        // } catch (error) {
        //     console.error("Error while deleting user:", error);
        //     return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Failed to delete user", null);
        // }
    }
    
    /**
     * Remove a user from an organization
     * @param {number} organizationId
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    removeUserFromOrganization(organizationId, userId){
        // not necessary for MVP
    }


    /**
     * Delete the notification with the given id 
     * @param {number} userId 
     * @param {number} notificationId 
     * @returns {CustomResponse<void>}
     */
    deleteNotification(userId, notificationId){
        // not necessary for MVP
    }


    //////////////////////////// Reading ///////////////////////////

    /**
     * Convert a mongoose structure (userModel) to a user structure (User)
     * @param {UserModel} userModel 
     * @returns {User}
     */
    convertUserModelToUser(userModel) {
        return new User(userModel.userId, userModel.userName, userModel.organizations,userModel.userKind, userModel.email);
    }

    /**
     * Return one single user
     * @param {number} userId
     * @returns {CustomResponse<User>}
     */
    async readUser(userId) {
        if (typeof userId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, "Invalid userId", null)
        }
        try {
            const user = await UserModel.findOne({ userId: userId }).exec(); 
            if (user) {
                return new CustomResponse(Errors.OK, "User found", this.convertUserModelToUser(user));
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
            let users = await UserModel.find();
            if (users == null) {
                return new CustomResponse(Errors.OK, "", []);
            }
            users = users.map((user) => this.convertUserModelToUser(user));
            return new CustomResponse(Errors.OK, "", users);
            
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
    async readUserNotifications(userId) {
        if (typeof userId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, "Invalid userId", null);
        }

        try {
            
            let user = await UserModel.findOne({ userId: userId }).exec();
            if (!user) {
                return new CustomResponse(Errors.NOT_FOUND, "user not found", null);
            }

            let notifications = await NotificationModel.find({ userId: userId }).exec();
            if (!notifications) {
                return new CustomResponse(Errors.BAD_REQUEST, "user not found", null);
            }

            notifications = notifications.map((notification) => { return new Notification(notification.notificationId, notification.userId, notification.notificationText, notification.date, notification.read) });

          
            return new CustomResponse(Errors.OK, "", notifications);
        } catch (error) {
            console.error("Error while searching for notifications:", error);
            return new CustomResponse(Error.INTERNAL_SERVER_ERROR, "Failed to fetch notifications", null);
        }
    }


    ////////////////////////// Authentication ////////////////////////

    /**
     * @param {number} userId
     * @param {CustomUserInfo} customUserInfo
     * @returns {CustomResponse<number>}
    */
    createCustomUserInfo(userId, customUserInfo){
        // not necessary for MVP
    }

    /**
     * @param {number} userId 
     * @param {FacebookUserInfo} facebookUserInfo 
     * @returns {CustomResponse<number>}
     */
    createFacebookUserInfo(userId, facebookUserInfo){
        // not necessary for MVP
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
        // not necessary for MVP
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<FacebookUserInfo>}
     */
    readFacebookUserInfo(userId){
        // not necessary for MVP
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
        // not necessary for MVP
    }
    
    /**
     * @param {number} userId 
     * @param {FacebookUserInfo} newFacebookUserInfo 
     * @returns {CustomResponse<void>}
     */
    updateFacebookUserInfo(userId, newFacebookUserInfo){
        // not necessary for MVP
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
        // not necessary for MVP
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    deleteFacebookUserInfo(userId){
        // not necessary for MVP
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<void>}
     */
    deleteGoogleUserInfo(userId){
        // not necessary for MVP
    }
}

exports.UserManager = UserManager;

