const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthControllers/authController');

// Routes
router.get('/login', authController.login);
router.post('/login', authController.loginSubmit);
router.get('/register', authController.register);
router.post('/register', authController.registerSubmit);
router.get('/logout', authController.logout);
router.get('/lock_screen', authController.lockScreen);
router.post('/lock_screen', authController.lockScreenSub);

module.exports = router;