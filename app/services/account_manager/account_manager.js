const { ServicesBaseClass } = require('../services_base_class.js');
const { OauthLogInInfo } = require('../../common_infrastructure/oauth_login_info.js');
const { getGoogleOauthUrl, getNameAndEmail } = require('./google_oauth.js');
const { CustomResponse } = require('../../common_infrastructure/response.js');
const { Errors } = require('../../common_infrastructure/errors.js');
const { UserKind } = require('../../common_infrastructure/user_kind.js');
const { LogInResponse } = require('../../common_infrastructure/log_in_response.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../../common_infrastructure/user.js');
const accountRouter = express.Router();
const userRouter = express.Router();
const {requestWrapper} = require('../../middleware/global_error_handler_middleware.js')

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
     * @param {string} userName
     * @returns {CustomResponse<LogInResponse>}
     */
    async googleLogIn(userName) {
        let v;

        let user = await this.userManager.readUserByName(userName);
        if (user.statusCode != Errors.OK) {
            return user;
        }

        return this.generateUserToken(user.payload.userId);
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
            return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "Error when getting user info from google, oauth token is probably invalid", null);
        }

        let nameExists = await this.userManager.readUserByName(v.name);
        if (nameExists.statusCode == Errors.OK) {
            if (v.email != nameExists.payload.email) {
                // todo: implement a system to add a postfix to the user name if i have already a user with the same name
                return new CustomResponse(Errors.BAD_REQUEST, "User already exists", null);
            }
            // if user is already signed up, i automatically log him in
            return await this.googleLogIn(v.name);
        }

        let response = await this.userManager.createUser(
            new User(
                0,
                v.name,
                [],
                UserKind.Google,
                v.email
            )
        );

        if (response.statusCode != Errors.OK) {
            console.log(response);
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
        try {
            const token = jwt.sign({ userId: userId }, process.env.SUPER_SECRET, { expiresIn: '1d' });
            return new CustomResponse(
                Errors.OK,
                "Success",
                new LogInResponse(userId, token)
            );
        } catch (error) {
            console.error(error);
            return new CustomResponse(
                Errors.INTERNAL_SERVER_ERROR,
                "Error generating token",
                null
            );
        }
    }

    /**
     * return true if the user token is valid 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<bool>}
     */
    async verifyUserToken(userId, userToken) {
        try {
            const decoded = jwt.verify(userToken, SECRET_KEY);
            if (decoded.userId === userId) {
                return new CustomResponse(
                    Errors.OK,
                    "Success",
                    true
                );
            } else {
                return new CustomResponse(
                    Errors.UNAUTHORIZED,
                    "Invalid token: User ID does not match",
                    false
                );
            }
        } catch (error) {
            console.error(error);
            return new CustomResponse(
                Errors.UNAUTHORIZED,
                "Invalid token",
                false
            );
        }
    }

    /**
     * return true if an user is in an organization
     * @param {number} userId 
     * @param {number} organizationId 
     * @returns {CustomResponse<bool>}
     */
    async verifyUserIsInOrganization(userId, organizationId) {
       let user = await this.userManager.readUser(userId); 
       if (user.statusCode != Errors.OK) {
           return user;
       }
       let organizations = user.payload.organizations;
       let condition = organizations.find((org) => org == organizationId) != undefined;
       return new CustomResponse(Errors.OK, "Success", condition);
    }
}

const accountManager = new AccountManager();

accountRouter.get('/google/oauth_info',requestWrapper( (req, res) => {
    let response = accountManager.getGoogleOauthLogInInfo();
    res.status(response.statusCode)
    res.json(response)
}));

// this need to be a get because of google's redirect
accountRouter.get('/google/callback',requestWrapper( async (req, res) => {
    let response  = await accountManager.googleSignUp(req.query.code);
    if (response.statusCode == Errors.OK) {
        res.redirect(process.env.AFTER_SIGNUP_REDIRECT_URI + '?response=' + JSON.stringify(response));
        return;
    }
    res.redirect(process.env.AFTER_BAD_LOGIN_REDIRECT_URI+ '?response=' + JSON.stringify(response));
}));

// return the user id starting from a name
userRouter.get('/id',requestWrapper( async (req, res) => {
    let response = await accountManager.getUserByName(req.query.name);
    res.status(response.statusCode)
    res.json(response)
}));

// return all the user informations starting from an id
userRouter.get('/:userId',requestWrapper( async (req, res) => {

    if(req.loggedUser != req.params.userId){
        res.status(403)
        res.json(new CustomResponse(Errors.UNAUTHORIZED, "You are not authorized to see this user", null))
        return;
    }

    let user = req.params.userId * 1;
    let response = await accountManager.getUserById(user);
    res.status(response.statusCode)
    res.json(response)
}));

// return the user name starting from an id
userRouter.get('/:userId/name',requestWrapper( async (req, res) => {
    let user = req.params.userId * 1;
    let response = await accountManager.getUserName(user);
    res.status(response.statusCode)
    res.json(response)
}));

exports.accountRouter = accountRouter;
exports.userRouter = userRouter;
exports.accountManager = accountManager;

