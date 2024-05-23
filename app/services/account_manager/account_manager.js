const {ServicesBaseClass} = require('../services_base_class.js');
const {OauthLogInInfo} = require('../../common_infrastructure/oauth_login_info.js');
const {getGoogleOauthUrl} = require('./google_oauth.js');
const {CustomResponse} = require('../../common_infrastructure/response.js');
const {Errors} = require('../../common_infrastructure/errors.js');

const express = require('express');
const router = express.Router();

class AccountManager extends ServicesBaseClass{

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
        return new CustomResponse(
            Errors.OK,
            "Success",
            new OauthLogInInfo(getGoogleOauthUrl())
        )
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
    customSignUp(userName, userPassword){
    }
    
    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {string} oauthCode 
     * @returns {CustomResponse<bool>}
     */
    googleSignUp(oauthCode){
    }
    
    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {string} oauthCode 
     * @returns {CustomResponse<bool>}
     */
    facebookSignUp(oauthCode){
    }
    /**
     * register a user with a custom account
     * return true if the user was created successfully, false if the user already exists
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @param {?string} oauthToken 
     * @returns {CustomResponse<bool>}
     */
    signUp(userName, userPassword, oauthToken){
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


const accountManager = new AccountManager();

router.get('/google/oauth_info', (req, res) => {
    response = accountManager.getGoogleOauthLogInInfo();
    res.status(response.statusCode)
    res.json(response)
});

exports.accountManagerRouter = router;
exports.accountManager = accountManager;