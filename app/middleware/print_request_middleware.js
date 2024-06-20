function printRequestMiddleware(req, res, next) {
    if (res.headersSent) {
        console.log(req.method, req.url, res.statusCode);
    } else {
        res.on('finish', function () {
            console.log(req.method, req.url, res.statusCode);
        })
    }
    next();
}

exports.printRequestMiddleware = printRequestMiddleware;