const mongoose = require("mongoose");

const partnershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Partnership = mongoose.model("Partnership", partnershipSchema);

module.exports = Partnership;