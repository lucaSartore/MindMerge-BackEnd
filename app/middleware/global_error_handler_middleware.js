const { CustomResponse } = require("../common_infrastructure/response");
const { Errors } = require("../common_infrastructure/errors");

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(Errors.INTERNAL_SERVER_ERROR)
  res.json(new CustomResponse(Errors.INTERNAL_SERVER_ERROR, 'Internal server error: ' + err, null))
}

function requestWrapper(fn) {
    return async (req, res, next) => {
        try {
            return await fn(req, res);
        } catch (err) {
            next(err);
        }
    }
}

exports.errorHandler = errorHandler;
exports.requestWrapper = requestWrapper;