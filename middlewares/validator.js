const Joi = require("joi");

const appointmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().min(6).max(60).required(),
  description: Joi.string().min(10).max(500).required(),
  preferredDate: Joi.date().greater("now").required(),
  preferredTime: Joi.string().required(),
  service: Joi.string().valid(
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
  ).required(),
});

const validateAppointment = (data) => {
  return appointmentSchema.validate(data);
};

module.exports = { validateAppointment };
