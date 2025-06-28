import mongoose, { Document, Model } from "mongoose";

export interface IDisasterMember extends Document {
  disasterId: string;
  userId: string;
  userName: string;
  departmentId: number;
  joinedAt: Date;
  isActive: boolean;
}

const DisasterMemberSchema = new mongoose.Schema(
  {
    disasterId: {
      type: String,
      required: [true, "Disaster ID is required"],
      index: true,
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
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "DisasterMembers",
  }
);

// Compound unique index
DisasterMemberSchema.index({ disasterId: 1, userId: 1 }, { unique: true });

const DisasterMember: Model<IDisasterMember> =
  (mongoose.models.DisasterMember as Model<IDisasterMember>) ||
  mongoose.model<IDisasterMember>("DisasterMember", DisasterMemberSchema);

export default DisasterMember;
