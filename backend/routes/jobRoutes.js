const express = require('express');
const { getJobs, getJobById } = require('../controllers/jobController');
const { ensureDb } = require('../middleware/dbMiddleware');

const router = express.Router();

router.get('/', ensureDb, getJobs);
router.get('/:id', ensureDb, getJobById);

module.exports = router;
