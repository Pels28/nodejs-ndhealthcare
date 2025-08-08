const Contact = require("../models/contactModel");
const {
  sendContactConfirmation,
  sendContactAdminNotification,
} = require("../utils/email");
const { validateContact } = require("../middlewares/validator");
const User = require("../models/usersModel");
const dbConnect = require("../lib/dbConnect");

exports.createContact = async (req, res) => {
  try {
    await dbConnect();
    const { name, phoneNumber, email, subject, message } = req.body;

    const { error } = validateContact({
      name,
      phoneNumber,
      email,
      subject,
      message,
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

    const newContact = await Contact.create({
      user: user._id,
      message,
      subject,
    });

    const emailData = {
      ...newContact.toObject(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      subject,
      message
    };

    // Send emails in parallel
    await Promise.all([
      sendContactConfirmation(emailData),
      sendContactAdminNotification(emailData)
    ]);

    res.status(201).json({
      success: true,
      message: "Message sent. Confirmation emails sent.",
      data: {
        contact: newContact,
        user: { name, email, phoneNumber },
      },
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
      error: error.message.includes("duplicate key")
        ? "This email is already associated with an account"
        : error.message,
    });
  }
};