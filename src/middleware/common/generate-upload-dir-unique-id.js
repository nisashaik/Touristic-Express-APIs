exports.generateDirUniqueId = (req, res, next) => {
    req.dirUniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    next();
};