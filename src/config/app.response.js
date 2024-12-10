const { currentDateTime } = require("../helpers/date.helper");

exports.successRes = (code, title, message, data, metaData) => ({
    status_code: code,
    captureDT: currentDateTime(),
    result: {
        title, message, data, metaData
    }
});

exports.errorRes = (code, title, error) => ({
    status_code: code,
    captureDT: currentDateTime(),
    result: {
        title, error
    }
});

