const express = require('express');
const { applyForJob, getApplicationsForJob, shortlistCandidate } = require('../controllers/applicationController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/applications/apply/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.post('/apply/:jobId', ensureDb, authenticateToken, applyForJob);

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of applications
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.get('/job/:jobId', ensureDb, authenticateToken, isEmployer, getApplicationsForJob);

/**
 * @swagger
 * /api/applications/shortlist/{applicationId}:
 *   post:
 *     summary: Shortlist a candidate
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate shortlisted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Application not found
 */
router.post('/shortlist/:applicationId', ensureDb, authenticateToken, isEmployer, shortlistCandidate);

module.exports = router;
