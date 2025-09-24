const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { setup, teardown, clearDatabase } = require('./test-setup');
const Employer = require('../models/employerModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const Application = require('../models/applicationModel');
const jwt = require('jsonwebtoken');

describe('Application Routes', () => {
  let employer;
  let user;
  let job;
  let employerToken;
  let userToken;

  before(async () => {
    await setup();
    await clearDatabase();

    // Create a new employer
    employer = new Employer({
      companyName: 'Test Corp',
      email: 'employer@test.com',
      password: 'password123',
    });
    await employer.save();
    employerToken = jwt.sign({ _id: employer._id, userType: 'employer' }, "MySuperSecretKey123!@#$%^&*()_+=123");

    // Create a new user
    user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@test.com',
      password: 'password123',
    });
    await user.save();
    userToken = jwt.sign({ _id: user._id, userType: 'user' }, "MySuperSecretKey123!@#$%^&*()_+=123");

    // Create a new job
    job = new Job({
      title: 'Software Engineer',
      description: 'A great job',
      company: 'Test Corp',
      candidate_required_location: 'Remote',
      job_type: 'Full-time',
      employer: employer._id,
    });
    await job.save();
  });

  after(async () => {
    await teardown();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/applications/job/:jobId', () => {
    it('should return all applications for a job with applicant details', async () => {
      // Create an application
      const application = new Application({
        job: job._id,
        applicant: user._id,
      });
      await application.save();

      const res = await request(app)
        .get(`/api/applications/job/${job._id}`)
        .set('Authorization', `Bearer ${employerToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0].applicant).to.have.property('firstName', 'John');
      expect(res.body[0].applicant).to.have.property('lastName', 'Doe');
      expect(res.body[0].applicant).to.have.property('email', 'user@test.com');
    });
  });
});
