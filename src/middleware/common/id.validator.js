const { errorRes } = require('../../config/app.response');

const ObjectId  = require('mongoose').Types.ObjectId;

exports.isValidObjectID = (req, res, next) => {
    if(req.params?.id) {
        id = req.params.id;
        if(ObjectId.isValid(id) && new ObjectId(id) == id) {
            return next();
        } 
        res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            "Is correct ID provided!"
        ))
    }
}