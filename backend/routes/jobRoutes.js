const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  getEmployerJobs,
  getApplicationForJob,
  updateJob,
  deleteJobs,
} = require('../controllers/jobController');
const { ensureDb } = require('../middleware/dbMiddleware');
const { authenticateToken, isEmployer, isJobSeeker } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: A list of jobs
 */
router.get('/', ensureDb, getJobs);

/**
 * @swagger
 * /api/jobs/employers:
 *   get:
 *     summary: Get jobs for the logged-in employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of jobs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/employers', ensureDb, authenticateToken, isEmployer, getEmployerJobs);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - description
 *               - candidate_required_location
 *               - job_type
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               candidate_required_location:
 *                 type: string
 *               job_type:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Contract, Internship, Freelance]
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', ensureDb, authenticateToken, isEmployer, createJob);

/**
 * @swagger
 * /api/jobs/delete-all:
 *   delete:
 *     summary: Delete all jobs for the logged-in employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All jobs deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/delete-all', ensureDb, authenticateToken, isEmployer, deleteJobs);

/**
 * @swagger
 * /api/jobs/delete-multiple:
 *   post:
 *     summary: Delete multiple jobs for the logged-in employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobIds
 *             properties:
 *               jobIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Jobs deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/delete-multiple', ensureDb, authenticateToken, isEmployer, deleteJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A job object
 *       404:
 *         description: Job not found
 */
router.get('/:id', ensureDb, getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               candidate_required_location:
 *                 type: string
 *               job_type:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Contract, Internship, Freelance]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.put('/:id', ensureDb, authenticateToken, isEmployer, updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
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
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.delete('/:id', ensureDb, authenticateToken, isEmployer, deleteJobs);

/**
 * @swagger
 * /api/jobs/{id}/application:
 *   get:
 *     summary: Get the application for a job
 *     tags: [Jobs]
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
 *         description: An application object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.get('/:id/application', ensureDb, authenticateToken, isJobSeeker, getApplicationForJob);

module.exports = router;
