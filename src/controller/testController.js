const { successRes, errorRes } = require("../config/app.response");

function testController(req, res) {
    try {
        res.status(200).json(successRes(
            200,
            'SUCCESS',
            'Welcome to the backend of touristic application!!'
        ));
    } catch (error) {
        res.status(500).json(errorRes(
            500,
            'SERVER SIDE ERROR',
            error
        ));
    }
}
module.exports = testController;