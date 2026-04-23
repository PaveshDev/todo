const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date_of_birth: {
      type: Date,
    },
    gender: {
      type: String,
      trim: true,
    },
    blood_group: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    allergies: {
      type: String,
      trim: true,
    },
    medical_notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "patients",
  }
);

module.exports = mongoose.model("Patient", patientSchema);
