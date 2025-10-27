const express = require('express');
const { getUserDetails, getUserApplications, getAppliedJobs, getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get the details of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, ensureDb, getUserDetails);

/**
 * @swagger
 * /api/users/applications:
 *   get:
 *     summary: Get the applications of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of applications
 *       401:
 *         description: Unauthorized
 */
router.get('/applications', authenticateToken, ensureDb, getUserApplications);

/**
 * @swagger
 * /api/users/applied-jobs:
 *   get:
 *     summary: Get the applied jobs of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of jobs
 *       401:
 *         description: Unauthorized
 */
router.get('/applied-jobs', authenticateToken, ensureDb, getAppliedJobs);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken, ensureDb, getUserById);

module.exports = router;
