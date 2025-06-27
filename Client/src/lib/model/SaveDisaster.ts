import mongoose, { Document, Model } from "mongoose";

// Interface
export interface ISaveDisaster extends Document {
  name: string;
  severity?: string;
  foodHave: number;
  foodRequired: number;
  waterHave: number;
  waterRequired: number;
  medicalHave: number;
  medicalRequired: number;
  shelterHave: number;
  shelterRequired: number;
  blanketsHave: number;
  blanketsRequired: number;
  rescuePersonnelHave: number;
  rescuePersonnelRequired: number;
}

// Define the schema
const SaveDisasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Disaster name is required"],
    },
    activeStatus: {
        type: String,
        required: [true, "Active status required"],
    },
    severity: {
        type: String,
        required: [true, "Severity is required"],
    },
    foodHave: {
      type: Number,
      required: [true, "Available food quantity is required"],
    },
    foodRequired: {
      type: Number,
      required: [true, "Required food quantity is required"],
    },
    waterHave: {
      type: Number,
      required: [true, "Available water quantity is required"],
    },
    waterRequired: {
      type: Number,
      required: [true, "Required water quantity is required"],
    },
    medicalHave: {
      type: Number,
      required: [true, "Available medical supplies is required"],
    },
    medicalRequired: {
      type: Number,
      required: [true, "Required medical supplies is required"],
    },
    shelterHave: {
      type: Number,
      required: [true, "Available shelter units is required"],
    },
    shelterRequired: {
      type: Number,
      required: [true, "Required shelter units is required"],
    },
    blanketsHave: {
      type: Number,
      required: [true, "Available blankets is required"],
    },
    blanketsRequired: {
      type: Number,
      required: [true, "Required blankets is required"],
    },
    rescuePersonnelHave: {
      type: Number,
      required: [true, "Available rescue personnel is required"],
    },
    rescuePersonnelRequired: {
      type: Number,
      required: [true, "Required rescue personnel is required"],
    },
  },
  {
    timestamps: true,
    collection: "Disasters",
  }
);

// Check if model already exists to prevent model overwrite errors
const SaveDisasters: Model<ISaveDisaster> =
  (mongoose.models.SaveDisasters as Model<ISaveDisaster>) ||
  mongoose.model<ISaveDisaster>("SaveDisasters", SaveDisasterSchema);

export default SaveDisasters;
