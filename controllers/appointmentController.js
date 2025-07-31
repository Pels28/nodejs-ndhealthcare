const Appointment = require("../models/appointmentModel");
const {
  sendClientConfirmation,
  sendAdminNotification,
} = require("../utils/email");
const { validateAppointment } = require("../middlewares/validator");
const User = require("../models/usersModel");

exports.createAppointment = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      description,
      preferredDate,
      preferredTime,
      service,
    } = req.body;

    const { error } = validateAppointment({
      name,
      phoneNumber,
      email,
      description,
      preferredDate,
      preferredTime,
      service,
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

    const newAppointment = await Appointment.create({
      user: user._id,
      description,
      preferredDate: new Date(preferredDate),
      preferredTime,
      service,
    });

    const emailData = {
      ...newAppointment.toObject(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    // Send emails in parallel (both client and admin)
    await Promise.all([
      sendClientConfirmation(emailData),
      sendAdminNotification(emailData),
      // sendAppointmentSMS(phoneNumber, emailData)
    ]);

    res.status(201).json({
      success: true,
      message: "Appointment created successfully. Confirmation emails sent.",
      data: {
        appointment: newAppointment,
        user: { name, email, phoneNumber }, // Return basic user info
      },
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message.includes("duplicate key")
        ? "This email is already associated with an account"
        : error.message,
    });
  }
};
