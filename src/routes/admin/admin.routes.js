const { listCategories, createCategory, updateCategory, deleteCategory } = require('../../controller/admin/categories.controller');
const { listPackages, createPackage, updatePackage, deletePackage, getPakcage } = require('../../controller/admin/packages.controller');
const { createRole, listRoles, updateRole, deleteRole } = require('../../controller/admin/role.controller');
const { updateProfile } = require('../../controller/admin/settings.controller');
const { roleCtrInputValidator, categoryCtrInputValidator, pakcageCtrInputValidator } = require('../../helpers/request.input.validator');
const { isAuthenticatedUser } = require('../../middleware/admin/admin.app.authentication');
const { generateDirUniqueId } = require('../../middleware/common/generate-upload-dir-unique-id');
const { isValidObjectID } = require('../../middleware/common/id.validator');
const { validate } = require('../../middleware/validate.inputs');
const packageUploads = require('../../services/docupload/packages.upload');

const router = require('express').Router();
const routePrefix = '/admin/';
// Role routes
router.get(`${routePrefix}role`, [isAuthenticatedUser], listRoles);
router.post(`${routePrefix}role`, [isAuthenticatedUser, validate(roleCtrInputValidator())], createRole);
router.put(`${routePrefix}role/:id`, [isAuthenticatedUser, isValidObjectID, validate(roleCtrInputValidator("edit"))], updateRole);
router.delete(`${routePrefix}role/:id`, [isAuthenticatedUser, isValidObjectID], deleteRole);
// Settings routes
router.post(`${routePrefix}settings/update-profile`,[isAuthenticatedUser], updateProfile);
// Pages routes
// Categories routes
router.get(`${routePrefix}categories`, [isAuthenticatedUser], listCategories);
router.post(`${routePrefix}category`, [isAuthenticatedUser, validate(categoryCtrInputValidator)], createCategory);
router.put(`${routePrefix}category/:id`, [isAuthenticatedUser, isValidObjectID, validate(categoryCtrInputValidator)], updateCategory);
router.delete(`${routePrefix}category/:id`, [isAuthenticatedUser, isValidObjectID], deleteCategory);
// Packages routes
router.get(`${routePrefix}packages`, [isAuthenticatedUser], listPackages);
router.post(`${routePrefix}package`, [isAuthenticatedUser, generateDirUniqueId, packageUploads.fields([{name: 'featured_image', maxCount: 1}, {name: 'gallery_images', maxCount: 8}]), validate(pakcageCtrInputValidator)], createPackage);
router.get(`${routePrefix}package/:id`, [isAuthenticatedUser, isValidObjectID], getPakcage);
router.put(`${routePrefix}package/:id`, [isAuthenticatedUser, generateDirUniqueId, packageUploads.fields([{name: 'featured_image', maxCount: 1}, {name: 'gallery_images', maxCount: 8}]), isValidObjectID, validate(pakcageCtrInputValidator)], updatePackage);
router.delete(`${routePrefix}package/:id`, [isAuthenticatedUser, isValidObjectID], deletePackage);
module.exports = router;