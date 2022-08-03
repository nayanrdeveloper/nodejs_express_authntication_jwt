// const express = require('express');
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const checkUserAuth = require('../middlewares/auth-middleware');

// Route Level Middleware - To Protect Route
router.use('/change_password',checkUserAuth);
router.use('/logged-user',checkUserAuth);

// Public Routes 
router.post('/registration', userController.userRegistration);
router.post('/login', userController.userLogin);
router.post('/send-reset-password-email', userController.sendUserPasswordResetEmail);
router.post('/reset-password/:id/:token', userController.userPasswordReset);



// Protected Routes
router.post('/change_password', userController.changePassword);
router.get('/logged-user', userController.loggedUser);



module.exports = router;