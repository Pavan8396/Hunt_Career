const express = require('express');
const { registerEmployer, loginEmployer, getEmployerApplications, getApplicationsOverTime, getJobPostingsSummary, getRecentActivity, getEmployerById } = require('../controllers/employerController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/employers/register:
 *   post:
 *     summary: Register a new employer
 *     tags: [Employers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - companyName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               companyName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employer registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', ensureDb, registerEmployer);

/**
 * @swagger
 * /api/employers/login:
 *   post:
 *     summary: Login an employer
 *     tags: [Employers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employer logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', ensureDb, loginEmployer);

/**
 * @swagger
 * /api/employers/applications:
 *   get:
 *     summary: Get the applications for the logged-in employer
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of applications
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/applications', ensureDb, authenticateToken, isEmployer, getEmployerApplications);

/**
 * @swagger
 * /api/employers/stats/applications-over-time:
 *   get:
 *     summary: Get application stats over time
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application stats
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/stats/applications-over-time', ensureDb, authenticateToken, isEmployer, getApplicationsOverTime);

/**
 * @swagger
 * /api/employers/stats/job-postings-summary:
 *   get:
 *     summary: Get job postings summary
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job postings summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/stats/job-postings-summary', ensureDb, authenticateToken, isEmployer, getJobPostingsSummary);

/**
 * @swagger
 * /api/employers/stats/recent-activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/stats/recent-activity', ensureDb, authenticateToken, isEmployer, getRecentActivity);

/**
 * @swagger
 * /api/employers/{id}:
 *   get:
 *     summary: Get an employer by ID
 *     tags: [Employers]
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
 *         description: An employer object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employer not found
 */
router.get('/:id', ensureDb, authenticateToken, getEmployerById);

module.exports = router;
