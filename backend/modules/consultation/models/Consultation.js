const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    consultationId: {
      type: String,
      required: [true, "Consultation ID is required"],
      unique: true,
      trim: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["booked", "in-progress", "completed", "cancelled"],
      default: "booked",
    },
    consultationDate: {
      type: Date,
      required: [true, "Consultation date is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);
