import mongoose, { Document, Model } from "mongoose";

export interface IChatMessage extends Document {
  disasterId: string;
  text: string;
  userId: string;
  userName: string;
  departmentId: number;
  timestamp: Date;
}

const ChatMessageSchema = new mongoose.Schema(
  {
    disasterId: {
      type: String,
      required: [true, "Disaster ID is required"],
      index: true,
    },
    text: {
      type: String,
      required: [true, "Message text is required"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    departmentId: {
      type: Number,
      required: [true, "Department ID is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "ChatMessages",
  }
);

// Compound index for efficient querying
ChatMessageSchema.index({ disasterId: 1, timestamp: 1 });

const ChatMessage: Model<IChatMessage> =
  (mongoose.models.ChatMessage as Model<IChatMessage>) ||
  mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

export default ChatMessage;
