const { successRes, errorRes } = require("../config/app.response");

// handeling route not found errors
exports.routeNotFound = (req, res, next) => {
    res.status(404).json(successRes(
        404,
        "ROUTE NOT FOUND",
        'Opps! request url not found'
    ));
}

// handeling server side errors
exports.errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next('Something went wrong, App server error');
    }
    res.status(500).json(errorRes(
        500,
        "SERVER ERROR",
        error.message || 'Something went wrong, There is an error'
    ));
}