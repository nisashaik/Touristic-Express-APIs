const { registerUser, loginUser, logoutUser, refreshToken } = require('../../controller/admin/auth.controllers');
const { adminRegUserInputs, adminLoginInputs } = require('../../helpers/request.input.validator');
const { isAuthenticatedUser, isRefreshTokenValid } = require('../../middleware/admin/admin.app.authentication');
const { validate } = require('../../middleware/validate.inputs');

const router = require('express').Router();

const routePrefix = '/admin/auth/'

// admin auth routes login register forgot password reset password
router.post(`${routePrefix}register`, [validate(adminRegUserInputs)], registerUser);
router.post(`${routePrefix}login`, [validate(adminLoginInputs)], loginUser);
router.post(`${routePrefix}logout`, [isAuthenticatedUser], logoutUser);
router.get(`${routePrefix}refresh-token`, [isRefreshTokenValid], refreshToken);

module.exports = router;