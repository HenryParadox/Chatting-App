const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  message: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model("Chats", chatSchema);

module.exports = Chat;
