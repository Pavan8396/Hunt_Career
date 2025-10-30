const express = require('express');
const { getStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(ensureDb, authenticateToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
