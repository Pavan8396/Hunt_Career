const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Applications',
      key: 'id',
    },
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
  participants: {
    type: DataTypes.JSON, // Stores array of UUIDs
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'Chats',
  timestamps: true,
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  chatId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Chats',
      key: 'id',
    },
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Messages',
  timestamps: false,
});

const Application = require('./applicationModel');
const Job = require('./jobModel');

Chat.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });
Chat.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });

module.exports = { Chat, Message };
