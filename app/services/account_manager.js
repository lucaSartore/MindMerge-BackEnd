import ServicesBaseClass from './services_base_class.js';

export default class AccountManager extends ServicesBaseClass{

    /**
     * find a user id starting from a name
     * @param {string} name 
     * @returns {CustomResponse<number>}
     */
    findUserByName(name){
    }

    /**
     * @returns {CustomResponse<OauthLogInInfo>}
     */
    getGoogleOauthLogInInfo(){
    }

    /**
     * @returns {CustomResponse<OauthLogInInfo>}
     */
    getFacebookOauthLogInInfo(){
    }

    /**
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @returns {CustomResponse<LogInResponse>}
     */
    customLogIn(userName, userPassword){
    }
    
    /**
     * @param {string} oauthCode 
     * @returns {CustomResponse<LogInResponse>}
     */
    googleLogIn(oauthCode){
    }
    
    /**
     * @param {string} oauthCode 
     * @returns {CustomResponse<LogInResponse>}
     */
    facebookLogIn(oauthCode){
    }

    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @returns {CustomResponse<LogInResponse>}
     */
    customSignIn(userName, userPassword){
    }
    
    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {string} oauthCode 
     * @returns {CustomResponse<bool>}
     */
    googleSignIn(oauthCode){
    }
    
    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {string} oauthCode 
     * @returns {CustomResponse<bool>}
     */
    facebookSignIn(oauthCode){
    }
    /**
     * register a user with a custom account
     * return true if the user was created successfully, false if the user already exists
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @param {?string} oauthToken 
     * @returns {CustomResponse<bool>}
     */
    signIn(userName, userPassword, oauthToken){
    }

    /**
     * @param {newUserName} userId 
     * @param {string} userToken 
     * @param {string} newUserName 
     * @returns {CustomResponse<void>}
     */
    editUserName(userId, userToken, newUserName){
    }
 
    /**
     * @param {newUserName} userId 
     * @param {string} userToken 
     * @param {string} newPassword 
     * @returns {CustomResponse<void>}
     */
    changePassword(userId, userToken, newPassword){
    }

    /**
     * @param {number} userId
     * @param {string} userToken
     * @returns {CustomResponse<void>} 
     */
    deleteAccount(userId, userToken){
    }
}