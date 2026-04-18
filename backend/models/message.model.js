import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        senderName: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Compound index for efficient queries: get messages for a project sorted by time
messageSchema.index({ projectId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
