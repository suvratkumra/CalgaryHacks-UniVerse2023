import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        Chatusers: {
            type: Array,
            require: true
        },
        message: {
            type: String,
            require: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
