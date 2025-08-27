const express = require('express');
const router = express.Router();
const { signup, logout, login } = require('../controllers/authController'); 

// POST /auth/signup
router.post("/signup", signup);

// POST /auth/login
router.post("/login", login);

// POST /auth/logout
router.post("/logout", logout);

module.exports = router;
