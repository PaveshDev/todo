const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");

// ──────────────────────────────────────────────
// CREATE – Book a new consultation
// POST /api/consultations
// ──────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { consultationId, patientName, doctorName, consultationDate, notes } =
      req.body;

    const consultation = await Consultation.create({
      consultationId,
      patientName,
      doctorName,
      consultationDate,
      notes,
    });

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A consultation with this ID already exists",
      });
    }
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
// READ – Get all consultations (with optional filters)
// GET /api/consultations?status=completed&doctor=DoctorName
// ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.doctor) {
      filter.doctorName = { $regex: req.query.doctor, $options: "i" };
    }
    if (req.query.patient) {
      filter.patientName = { $regex: req.query.patient, $options: "i" };
    }
    const consultations = await Consultation.find(filter).sort({
      consultationDate: -1,
    });
    res.json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// VERIFY – Verify a consultation for feedback eligibility
// GET /api/consultations/verify/:consultationId
// Returns consultation details if it exists, is completed, and has no feedback yet
// ──────────────────────────────────────────────
router.get("/verify/:consultationId", async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      consultationId: req.params.consultationId,
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        eligible: false,
        message: "No consultation found with this ID. Please check and try again.",
      });
    }

    if (consultation.status !== "completed") {
      const statusMessages = {
        booked: "This consultation is still booked and has not been completed yet.",
        "in-progress": "This consultation is currently in progress. Please wait until it is completed.",
        cancelled: "This consultation was cancelled. Feedback cannot be submitted for cancelled consultations.",
      };
      return res.status(400).json({
        success: false,
        eligible: false,
        message: statusMessages[consultation.status] || "Consultation is not completed.",
        status: consultation.status,
      });
    }

    if (consultation.feedbackSubmitted) {
      return res.status(400).json({
        success: false,
        eligible: false,
        message: "Feedback has already been submitted for this consultation.",
      });
    }

    res.json({
      success: true,
      eligible: true,
      data: {
        consultationId: consultation.consultationId,
        patientName: consultation.patientName,
        doctorName: consultation.doctorName,
        consultationDate: consultation.consultationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// READ – Get a single consultation by ID
// GET /api/consultations/:id
// ──────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });
    }
    res.json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// UPDATE – Update consultation status
// PUT /api/consultations/:id
// ──────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });
    }

    const { status, notes, consultationDate } = req.body;

    if (status) consultation.status = status;
    if (notes !== undefined) consultation.notes = notes;
    if (consultationDate) consultation.consultationDate = consultationDate;

    const updatedConsultation = await consultation.save();
    res.json({ success: true, data: updatedConsultation });
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
// DELETE – Remove a consultation
// DELETE /api/consultations/:id
// ──────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });
    }

    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Consultation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
