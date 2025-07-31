const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: [
        "Full Support Services",
        "Baby and Child Care",
        "Home Visits/Assessments",
        "Post-Surgical Care",
        "Neurological Care",
        "Autism Care",
        "Dementia Care",
        "Elderly Support Care",
        "Bedridden Care",
        "Live-in Care"
      ],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;