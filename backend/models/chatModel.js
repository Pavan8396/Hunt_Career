const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  application: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true,
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
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema, 'Chats');