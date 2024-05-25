const {ServicesBaseClass} = require('../services_base_class.js');
const {OauthLogInInfo} = require('../../common_infrastructure/oauth_login_info.js');
const {getGoogleOauthUrl,getNameAndEmail} = require('./google_oauth.js');
const {CustomResponse} = require('../../common_infrastructure/response.js');
const {Errors} = require('../../common_infrastructure/errors.js');
const {UserKind} = require('../../common_infrastructure/user_kind.js');
const {LogInResponse} = require('../../common_infrastructure/log_in_response.js');

const express = require('express');
const { User } = require('../../common_infrastructure/user.js');
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
     * @returns {CustomResponse<LogInResponse>}
     */
    async googleSignUp(oauthCode){
        let v;
        try{
            v = await getNameAndEmail(oauthCode);
        }catch(e){
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Error when getting user info from google", null)
        } 

        // todo: verify in case of name existing but new email... add prefix to name
        let response = await this.userManager.createUser(
            new User(
                0,
                v.name,
                [],
                UserKind.Google,
                v.email
            )
        )

        if(response.statusCode != Errors.OK){
            console.log(response)
            return response;
        }

        let userToken = await this.generateUserToken(response.payload);

        if(userToken.statusCode != Errors.OK){
            return userToken;
        }

        return new CustomResponse(
            Errors.OK,
            "Success",
            new LogInResponse(response.payload.userId, userToken.payload)
        );
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


    /**
     * generate a jwt token for a user
     * @param {number} userId 
     * @returns {CustomResponse<string>}
     */
    async generateUserToken(userId){
        // TODO: implement for Gioele
        return new CustomResponse(
            Errors.OK,
            "Success",
            "token"
        )
    }
  

    /**
     * return true if the user token is valid 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<bool>}
     */
    async verifyUserToken(userId, userToken){
        // TODO: implement for Gioele
        return true;
    }
}


const accountManager = new AccountManager();

router.get('/google/oauth_info', (req, res) => {
    response = accountManager.getGoogleOauthLogInInfo();
    res.status(response.statusCode)
    res.json(response)
});

router.get('/google/callback', async (req, res) => {
    response = await accountManager.googleSignUp(req.query.code);
    res.status(response.statusCode)
    res.json(response)
});

exports.accountManagerRouter = router;
exports.accountManager = accountManager;