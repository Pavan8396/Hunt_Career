const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'messages.senderType',
  },
  senderType: {
    type: String,
    required: true,
    enum: ['User', 'Employer'],
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new Schema({
  application: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true,
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  ],
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);