const { registerCustomer, loginCustomer, isRefreshTokenValid, refreshToken, isAuthenticatedUser, logoutUser, getProfile, updateProfile } = require('../../controller/website/auth.controller');
const { paymentIntent } = require('../../controller/website/checkout.controller');
const { listPackageCategories, listPackages, getPackage, addFavourite, favourites, removeFavourite } = require('../../controller/website/common.controller');
const { getOrder, getOrders } = require('../../controller/website/order.controller');

const router = require('express').Router();

router.get('/categories', listPackageCategories);
router.post('/packages', listPackages)
router.get('/package/:slug', getPackage );

// Auth Routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/refresh-token', [isRefreshTokenValid], refreshToken);
router.post('/logout', [isAuthenticatedUser], logoutUser);

// Profile
router.get('/profile', [isAuthenticatedUser], getProfile);
router.post('/update-profile', [isAuthenticatedUser], updateProfile);

router.get('/favourites', [isAuthenticatedUser], favourites);
router.post('/add-favourite', [isAuthenticatedUser], addFavourite);
router.post('/remove-favourite', [isAuthenticatedUser], removeFavourite);

router.post('/checkout/payment-intent', [isAuthenticatedUser], paymentIntent);
router.get('/order/:id', [isAuthenticatedUser], getOrder)
router.get('/orders', [isAuthenticatedUser], getOrders)
module.exports = router;