const { Errors } = require('../common_infrastructure/errors.js');
const jwt = require('jsonwebtoken');
const { CustomResponse } = require('../common_infrastructure/response.js');
const {accountManager} = require('../services/account_manager/account_manager.js');

async function authenticationMiddleware(req, res, next)  {
    var token = req.body.token || req.query.token || req.headers['token'];

    if (!token){
        res.status(Errors.UNAUTHORIZED);
        res.json(new CustomResponse(Errors.UNAUTHORIZED, 'No token provided', null));
        return;
    }

    jwt.verify (
        token,
        process.env.SUPER_SECRET,
        async function(err, decoded) {
            if (err){
                res.status(Errors.UNAUTHORIZED);
                res.json(new CustomResponse(Errors.UNAUTHORIZED, 'Invalid token', null));
                return;
            }
            else {
                req.loggedUser = decoded.userId * 1;
                let organizationId = req.params.organization_id || req.query.organization_id;
                
                if (!organizationId){
                    next();
                    return;
                }
                organizationId = organizationId * 1;
                
                let isInOrganization = await accountManager.verifyUserIsInOrganization(req.loggedUser, organizationId)
                if (isInOrganization.statusCode != Errors.OK){
                    res.status(isInOrganization.statusCode);
                    res.json(isInOrganization);
                    return;
                }
                if (!isInOrganization.payload){
                    res.status(Errors.UNAUTHORIZED);
                    res.json(new CustomResponse(Errors.UNAUTHORIZED, 'User dose not have access to the specified organization', null));
                    return;
                }

                next();
            }
        }
    )
}

exports.authenticationMiddleware = authenticationMiddleware;