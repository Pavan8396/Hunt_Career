const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { setup, teardown, clearDatabase } = require('./test-setup');
const Employer = require('../models/employerModel');
const Job = require('../models/jobModel');
const jwt = require('jsonwebtoken');

describe('Job Routes', () => {
  let employer;
  let token;

  before(async () => {
    await setup();
    await clearDatabase();

    // Create a new employer
    employer = new Employer({
      companyName: 'Test Corp',
      email: 'test@test.com',
      password: 'password123',
    });
    await employer.save();

    // Generate a token for the employer
    token = jwt.sign({ _id: employer._id, userType: 'employer' }, "MySuperSecretKey123!@#$%^&*()_+=123");
  });

  after(async () => {
    await teardown();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete a job and remove it from the employer postedJobs', async () => {
      // Create a new job
      const job = new Job({
        title: 'Software Engineer',
        description: 'A great job',
        company: 'Test Corp',
        candidate_required_location: 'Remote',
        job_type: 'Full-time',
        employer: employer._id,
      });
      await job.save();

      // Add the job to the employer's postedJobs
      employer.postedJobs.push(job._id);
      await employer.save();

      // Delete the job
      const res = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);

      // Check that the job is deleted
      const deletedJob = await Job.findById(job._id);
      expect(deletedJob).to.be.null;

      // Check that the job is removed from the employer's postedJobs
      const updatedEmployer = await Employer.findById(employer._id);
      expect(updatedEmployer.postedJobs).to.not.include(job._id);
    });
  });
});
