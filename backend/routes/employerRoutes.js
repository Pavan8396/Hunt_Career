const express = require('express');
const { registerEmployer, loginEmployer } = require('../controllers/employerController');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.post('/register', ensureDb, registerEmployer);
router.post('/login', ensureDb, loginEmployer);

module.exports = router;
