const express = require('express');
const { validateRegister, register, validateOtp, verifyOtp, validateLogin, login, validateAddToCart, addToCart } = require('../controllers/userController');
const router = express.Router();

router.post('/register', validateRegister, register);
router.put('/verifyotp', validateOtp, verifyOtp);
router.post('/login', validateLogin, login);
router.post('/add_to_cart', validateAddToCart, addToCart);

module.exports = router;