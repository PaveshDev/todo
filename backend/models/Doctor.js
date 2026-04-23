const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    license_number: {
      type: String,
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    clinic_name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "doctors",
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
