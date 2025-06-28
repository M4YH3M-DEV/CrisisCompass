import mongoose, { Document, Model } from "mongoose";

// Interface
export interface IDepartment extends Document {
  name: string;
  depId: number;
  userId: string;
  password: string;
  foodHave: number;
  waterHave: number;
  medicalHave: number;
  shelterHave: number;
  blanketsHave: number;
  rescuePersonnelHave: number;
}

// Define the schema
const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
    },
    depId: {
      type: Number,
      required: [true, "Department ID is required"],
      unique: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    foodHave: {
      type: Number,
      required: [true, "Available food quantity is required"],
      default: 0,
    },
    waterHave: {
      type: Number,
      required: [true, "Available water quantity is required"],
      default: 0,
    },
    medicalHave: {
      type: Number,
      required: [true, "Available medical supplies is required"],
      default: 0,
    },
    shelterHave: {
      type: Number,
      required: [true, "Available shelter units is required"],
      default: 0,
    },
    blanketsHave: {
      type: Number,
      required: [true, "Available blankets is required"],
      default: 0,
    },
    rescuePersonnelHave: {
      type: Number,
      required: [true, "Available rescue personnel is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "Departments",
  }
);

// Check if model already exists to prevent model overwrite errors
const Departments: Model<IDepartment> =
  (mongoose.models.Departments as Model<IDepartment>) ||
  mongoose.model<IDepartment>("Departments", DepartmentSchema);

export default Departments;
