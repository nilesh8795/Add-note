const express = require('express');
const { Register,login,getUserProfile } = require('../controller/AuthController.js')
const { validateToken } = require('../middleware/authmidle.js')
const router = express.Router();

router.post('/register',Register);
router.post('/login',login);
router.get('/user/me',validateToken, getUserProfile);


module.exports = router;