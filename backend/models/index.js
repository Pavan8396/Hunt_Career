const User = require('./userModel');
const Employer = require('./employerModel');
const Job = require('./jobModel');
const Application = require('./applicationModel');
const { Chat, Message } = require('./chatModel');
const Review = require('./reviewModel');

// Associations

// Employer - Job
Employer.hasMany(Job, { foreignKey: 'employerId', as: 'postedJobs' });
Job.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });

// Job - Application
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// User - Application
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

// Application - Chat
Application.hasOne(Chat, { foreignKey: 'applicationId', as: 'chat' });
Chat.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// Job - Chat
Job.hasMany(Chat, { foreignKey: 'jobId', as: 'chats' });
Chat.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Chat - Message
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });

// Employer - Review
Employer.hasMany(Review, { foreignKey: 'employerId', as: 'reviews' });
Review.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });

// User - Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Employer,
  Job,
  Application,
  Chat,
  Message,
  Review
};
