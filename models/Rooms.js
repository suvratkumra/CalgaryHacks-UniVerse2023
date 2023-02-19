import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  content: String,
  user: String,
  room: String,
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;