const { Errors } = require('../common_infrastructure/errors.js');
const jwt = require('jsonwebtoken');
const {accountManager} = require('../services/account_manager/account_manager.js');

async function authenticationMiddleware(req, res, next)  {
    var token = req.body.token || req.query.token || req.headers['token'];

    if (!token){
        res.status(403);
        res.json({success:false, message: 'No token provided.'});
    }

    jwt.verify (
        token,
        process.env.SUPER_SECRET,
        async function(err, decoded) {
            if (err){
                res.status(403);
                res.json({success:false, message: 'Invalid token'})
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
                    res.status(403);
                    res.json({success:false, message: 'User has no access to the requested organization'});
                    return;
                }

                next();
            }
        }
    )
}

exports.authenticationMiddleware = authenticationMiddleware;