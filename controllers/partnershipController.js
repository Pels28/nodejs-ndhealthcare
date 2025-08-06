const Partnership = require("../models/partnershipModel");
const {
  sendPartnerConfirmation,
  sendPartnerAdminNotification,
} = require("../utils/email");
const { validatePartnership } = require("../middlewares/validator");
const User = require("../models/usersModel");
const dbConnect = require("../lib/dbConnect");

exports.createPartnership = async (req, res) => {
  try {

    await dbConnect(); // Ensure DB connection is established
    const {
      name,
      phoneNumber,
      email,
      institution,
      role,
    } = req.body;

    const { error } = validatePartnership({
      name,
      phoneNumber,
      email,
      institution,
      role,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

 

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, phoneNumber, email });
    }

    const newPartnership = await Partnership.create({
      user: user._id,
      institution,
      role,
    });
    

    const emailData = {
      ...newPartnership.toObject(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    // Send emails in parallel (both client and admin)
    await Promise.all([
      sendPartnerAdminNotification(emailData),
      sendPartnerConfirmation(emailData),
      // sendAppointmentSMS(phoneNumber, emailData)
    ]);

    res.status(201).json({
      success: true,
      message: "Partnership created successfully. Confirmation emails sent.",
      data: {
        partnership: newPartnership,
        user: { name, email, phoneNumber }, // Return basic user info
      },
    });
  } catch (error) {
    console.error("Partnership creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create partnership",
      error: error.message.includes("duplicate key")
        ? "This email is already associated with an account"
        : error.message,
    });
  }
};
