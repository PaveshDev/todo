const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
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
    consultationId: {
      type: String,
      required: [true, "Consultation ID is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Feedback comment is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    adminReply: {
      message: {
        type: String,
        trim: true,
        maxlength: [500, "Reply cannot exceed 500 characters"],
      },
      repliedBy: {
        type: String,
        trim: true,
      },
      repliedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to check if feedback is still editable
feedbackSchema.virtual("isEditable").get(function () {
  const hasAdminReply = Boolean(this.adminReply?.message && this.adminReply.message.trim());
  if (hasAdminReply) {
    return false;
  }

  const editWindowHours = parseInt(process.env.EDIT_WINDOW_HOURS) || 24;
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= editWindowHours;
});

// Ensure virtuals are included when converting to JSON
feedbackSchema.set("toJSON", { virtuals: true });
feedbackSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
