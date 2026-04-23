const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Consultation = require("../../consultation/models/Consultation");

// ──────────────────────────────────────────────
// CREATE – Submit a rating & feedback comment
// POST /api/feedback
// Only allowed for completed consultations with matching patient & doctor
// ──────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { patientName, doctorName, consultationId, rating, comment, categoryRatings, isAnonymousFeatured } =
      req.body;

    // 1. Verify the consultation exists
    const consultation = await Consultation.findOne({ consultationId });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "No consultation found with this ID. Please verify your Consultation ID.",
      });
    }

    // 2. Verify the consultation is completed
    if (consultation.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: `Cannot submit feedback. Consultation status is "${consultation.status}". Only completed consultations are eligible for feedback.`,
      });
    }

    // 3. Verify the patient name matches the consultation record
    if (consultation.patientName.toLowerCase() !== patientName.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Patient name does not match the consultation record. You can only submit feedback for your own consultation.",
      });
    }

    // 4. Verify the doctor name matches the consultation record
    if (consultation.doctorName.toLowerCase() !== doctorName.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Doctor name does not match the consultation record. You can only rate the doctor who consulted you.",
      });
    }

    // 5. Check if feedback has already been submitted for this consultation
    if (consultation.feedbackSubmitted) {
      return res.status(400).json({
        success: false,
        message: "Feedback has already been submitted for this consultation.",
      });
    }

    // 6. Create the feedback
    const feedback = await Feedback.create({
      patientName,
      doctorName,
      consultationId,
      rating,
      categoryRatings: {
        doctor: categoryRatings?.doctor || 0,
        service: categoryRatings?.service || 0,
        staff: categoryRatings?.staff || 0,
        app: categoryRatings?.app || 0,
      },
      isAnonymousFeatured: Boolean(isAnonymousFeatured),
      comment,
    });

    // 7. Mark the consultation as having feedback submitted
    consultation.feedbackSubmitted = true;
    await consultation.save();

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// READ – Get all feedback (with optional doctor filter)
// GET /api/feedback?doctor=DoctorName
// ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.doctor) {
      filter.doctorName = { $regex: req.query.doctor, $options: "i" };
    }
    if (req.query.patient) {
      filter.patientName = { $regex: req.query.patient, $options: "i" };
    }
    if (req.query.withReply === "true") {
      filter["adminReply.message"] = { $exists: true, $ne: "" };
    }
    if (req.query.withReply === "false") {
      filter.$or = [
        { "adminReply.message": { $exists: false } },
        { "adminReply.message": "" },
      ];
    }
    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// READ – Doctor rating summary (MUST be before /:id)
// GET /api/feedback/summary/doctors
// ──────────────────────────────────────────────
router.get("/summary/doctors", async (req, res) => {
  try {
    const summary = await Feedback.aggregate([
      {
        $group: {
          _id: "$doctorName",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          fiveStar: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          fourStar: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          threeStar: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          twoStar: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          doctorName: "$_id",
          averageRating: { $round: ["$averageRating", 1] },
          totalReviews: 1,
          breakdown: {
            fiveStar: "$fiveStar",
            fourStar: "$fourStar",
            threeStar: "$threeStar",
            twoStar: "$twoStar",
            oneStar: "$oneStar",
          },
        },
      },
      { $sort: { averageRating: -1 } },
    ]);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// READ – Get a single feedback by ID
// GET /api/feedback/:id
// ──────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// UPDATE – Edit feedback (within allowed time)
// PUT /api/feedback/:id
// ──────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    const hasAdminReply = Boolean(feedback.adminReply?.message && feedback.adminReply.message.trim());
    if (hasAdminReply) {
      return res.status(403).json({
        success: false,
        message: "This feedback can no longer be edited because an admin has already replied.",
      });
    }

    // Check edit window
    if (!feedback.isEditable) {
      const hours = process.env.EDIT_WINDOW_HOURS || 24;
      return res.status(403).json({
        success: false,
        message: `Edit window of ${hours} hours has expired. You can no longer edit this feedback.`,
      });
    }

    // Allow editing overall rating, category ratings, anonymous flag, and comment
    const { rating, comment, categoryRatings, isAnonymousFeatured } = req.body;
    if (rating !== undefined) feedback.rating = rating;
    if (categoryRatings !== undefined) {
      feedback.categoryRatings = {
        doctor: categoryRatings?.doctor || 0,
        service: categoryRatings?.service || 0,
        staff: categoryRatings?.staff || 0,
        app: categoryRatings?.app || 0,
      };
    }
    if (isAnonymousFeatured !== undefined) {
      feedback.isAnonymousFeatured = Boolean(isAnonymousFeatured);
    }
    if (comment !== undefined) feedback.comment = comment;

    const updatedFeedback = await feedback.save();
    res.json({ success: true, data: updatedFeedback });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// UPDATE – Add/Update admin or receptionist reply
// PATCH /api/feedback/:id/reply
// ──────────────────────────────────────────────
router.patch("/:id/reply", async (req, res) => {
  try {
    const { message, repliedBy } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required.",
      });
    }

    if (message.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Reply cannot exceed 500 characters.",
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    feedback.adminReply = {
      message: message.trim(),
      repliedBy: repliedBy?.trim() || "Reception",
      repliedAt: new Date(),
    };

    const updatedFeedback = await feedback.save();

    res.json({
      success: true,
      message: "Reply saved successfully.",
      data: updatedFeedback,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// DELETE – Remove feedback
// DELETE /api/feedback/:id
// ──────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
