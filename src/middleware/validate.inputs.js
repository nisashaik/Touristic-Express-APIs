const yup = require("yup");
const { errorRes } = require("../config/app.response");
const fs = require('fs');
const path = require('path');

exports.validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    // removing the uploaded files if any error occurs
    if(req.dirUniqueId) {
      const UPLOAD_DIR = `./public/uploads/packagesUploads/${req.dirUniqueId}`;
        if (fs.existsSync(UPLOAD_DIR)) {
            try {
                await fs.promises.rm(UPLOAD_DIR, { recursive: true, force: true })
            } catch(error) {
                throw new Error('Failed to delete directory');
            }
        }
    }
    return res.status(500).json(errorRes(
      500,
      "VALIDATION ERROR",
      err.message
    ))
  }
};