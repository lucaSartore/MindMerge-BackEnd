import DataBaseManager from './data_base_manager.js';

export default class UserManager extends DataBaseManager{

    //////////////////////////// Creation ////////////////////////////

    /**
     * Create a new user in the database, the id of the user will be automatically generated
     * return the id of the user created
     * @param {User} user 
     * @returns {CustomResponse<number>}
     */
    createUser(user){
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
    readUser(userId){
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