const { Errors } = require("../common_infrastructure/errors.js");

// inside our backend we prefer to use a single status code to represent success
// (200 in this case)
// this middleware will adjust the status code to be restful compliant
function adjustStatusCodeMiddleware(req, res, next) {
    let statusOld = res.status;
    res.status = function (code) {
        if (code == Errors.OK) {
            if (req.method == 'POST') {
                code = 201;
            }
            if (req.method == 'DELETE') {
                code = 204;
            }
        }
        return statusOld.call(this, code);
    }
    next();
}

exports.adjustStatusCodeMiddleware = adjustStatusCodeMiddleware;