const express = require('express');
const {
    getStats,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllEmployers,
    updateEmployer,
    deleteEmployer,
    toggleUserStatus,
    toggleEmployerStatus,
    toggleUserAdminStatus,
    getAllEmployerNames,
    getUserById,
} = require('../controllers/adminController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(ensureDb, authenticateToken, isAdmin);

// Dashboard Stats
router.get('/stats', getStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', toggleUserStatus);
router.put('/users/:id/make-admin', toggleUserAdminStatus);

// Employer Management
router.get('/employers/names', getAllEmployerNames);
router.get('/employers', getAllEmployers);
router.put('/employers/:id', updateEmployer);
router.delete('/employers/:id', deleteEmployer);
router.put('/employers/:id/status', toggleEmployerStatus);


module.exports = router;
