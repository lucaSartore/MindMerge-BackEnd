const { ServicesBaseClass } = require('../services_base_class.js');
const { OauthLogInInfo } = require('../../common_infrastructure/oauth_login_info.js');
const { getGoogleOauthUrl, getNameAndEmail } = require('./google_oauth.js');
const { CustomResponse } = require('../../common_infrastructure/response.js');
const { Errors } = require('../../common_infrastructure/errors.js');
const { UserKind } = require('../../common_infrastructure/user_kind.js');
const { LogInResponse } = require('../../common_infrastructure/log_in_response.js');

const express = require('express');
const { User } = require('../../common_infrastructure/user.js');
const accountRouter = express.Router();
const userRouter = express.Router();

class AccountManager extends ServicesBaseClass {

    /**
     * find a user id starting from a name
     * @param {string} name 
     * @returns {CustomResponse<number>}
     */
    async getUserByName(name) {
        let result = await this.userManager.readUserByName(name);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        return new CustomResponse(
            Errors.OK,
            "Success",
            result.payload.userId
        )
    }

    /**
     * @param {number} userId 
     * @returns {CustomResponse<User>}
     */
    async getUserById(userId) {
        return this.userManager.readUser(userId);
    }

    /**
     * @param {number} userId
     * @returns {CustomResponse<string>}
     */
    async getUserName(userId) {
        let result = await this.userManager.readUser(userId);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        return new CustomResponse(
            Errors.OK,
            "Success",
            result.payload.userName
        )
    }

    /**
     * @returns {CustomResponse<OauthLogInInfo>}
     */
    getGoogleOauthLogInInfo() {
        return new CustomResponse(
            Errors.OK,
            "Success",
            new OauthLogInInfo(getGoogleOauthUrl())
        )
    }

    /**
     * @returns {CustomResponse<OauthLogInInfo>}
     */
    getFacebookOauthLogInInfo() {
    }

    /**
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @returns {CustomResponse<LogInResponse>}
     */
    customLogIn(userName, userPassword) {
    }

    /**
     * @param {string} oauthCode 
     * @returns {CustomResponse<LogInResponse>}
     */
    googleLogIn(oauthCode) {
        return new CustomResponse(
            Errors.OK,
            "Success",
            new LogInResponse(1, "token")
        )
    }

    /**
     * @param {string} oauthCode 
     * @returns {CustomResponse<LogInResponse>}
     */
    facebookLogIn(oauthCode) {
    }

    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @returns {CustomResponse<LogInResponse>}
     */
    customSignUp(userName, userPassword) {
    }

    /**
     * return true if the user was created successfully, false if the user already exists
     * @param {string} oauthCode 
     * @returns {CustomResponse<LogInResponse>}
     */
    async googleSignUp(oauthCode) {
        let v;
        try {
            v = await getNameAndEmail(oauthCode);
        } catch (e) {
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

        if (response.statusCode != Errors.OK) {
            console.log(response)
            return response;
        }

        let userToken = await this.generateUserToken(response.payload);

        if (userToken.statusCode != Errors.OK) {
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
    facebookSignUp(oauthCode) {
    }
    /**
     * register a user with a custom account
     * return true if the user was created successfully, false if the user already exists
     * @param {?string} userName 
     * @param {?string} userPassword 
     * @param {?string} oauthToken 
     * @returns {CustomResponse<bool>}
     */
    signUp(userName, userPassword, oauthToken) {
    }

    /**
     * @param {newUserName} userId 
     * @param {string} userToken 
     * @param {string} newUserName 
     * @returns {CustomResponse<void>}
     */
    editUserName(userId, userToken, newUserName) {
    }

    /**
     * @param {newUserName} userId 
     * @param {string} userToken 
     * @param {string} newPassword 
     * @returns {CustomResponse<void>}
     */
    changePassword(userId, userToken, newPassword) {
    }

    /**
     * @param {number} userId
     * @param {string} userToken
     * @returns {CustomResponse<void>} 
     */
    deleteAccount(userId, userToken) {
    }


    /**
     * generate a jwt token for a user
     * @param {number} userId 
     * @returns {CustomResponse<string>}
     */
    async generateUserToken(userId) {
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
    async verifyUserToken(userId, userToken) {
        // TODO: implement for Gioele
        return true;
    }
}


const accountManager = new AccountManager();

/**
 * Return the oauth redirect uri
 */
accountRouter.get('/google/oauth_info', (req, res) => {
    let response = accountManager.getGoogleOauthLogInInfo();
    res.status(response.statusCode)
    res.json(response)
});

/**
 * The uri that google will redirect to after the user logs in
 */
accountRouter.get('/google/callback', async (req, res) => {
    let response = await accountManager.googleSignUp(req.query.code);
    if (response.statusCode == Errors.OK) {
        res.redirect(process.env.AFTER_SIGNUP_REDIRECT_URI + '?response=' + JSON.stringify(response));
        return;
    }
    response = await accountManager.googleLogIn(req.query.code);
    res.redirect(process.env.AFTER_SIGNIN_REDIRECT_URI + '?response=' + JSON.stringify(response));
});

userRouter.get('/id', async (req, res) => {
    let response = await accountManager.getUserByName(req.query.name);
    res.status(response.statusCode)
    res.json(response)
});
/**
  * @openapi
  * /api/v1/user/{userId}:
  *   get:
  *     summary: Get a user starting from an id
  *     description: Get a user starting from an id 
  *
  *     parameters:
  *             - name: userId
  *                 in: path
  *                 required: true
  *                 schema:
  *                     type : integer
  *     responses:
  *         200:
  *             description: Successfully returns the user
  *             content:
  *                 application/json:   
  *                     schema:
  *                         type: User
  * 
  */
userRouter.get('/:userId', async (req, res) => {
    let user = req.params.userId * 1;
    let response = await accountManager.getUserById(user);
    res.status(response.statusCode)
    res.json(response)
});

// return the user name starting from an id
userRouter.get('/:userId/name', async (req, res) => {
    let user = req.params.userId * 1;
    let response = await accountManager.getUserName(user);
    res.status(response.statusCode)
    res.json(response)
});

exports.accountRouter = accountRouter;
exports.userRouter = userRouter;