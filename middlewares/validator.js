const Joi = require("joi");

const appointmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().email().min(6).max(60).required(),
  description: Joi.string().min(5).max(500).required(),
  preferredDate: Joi.date().greater("now").required(),
  preferredTime: Joi.string().required(),
  service: Joi.string()
    .valid(
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
    )
    .required(),
});

const partnershipSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().email().min(6).max(60).required(),
  institution: Joi.string().min(2).max(100).required(),
  role: Joi.string().min(2).max(100).required(),
});

const reviewSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  location: Joi.string().min(2).max(100).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(5).max(500).required(),
  image: Joi.string().uri().optional(),
});

const validateAppointment = (data) => {
  return appointmentSchema.validate(data);
};

const validatePartnership = (data) => {
  return partnershipSchema.validate(data);
};

const validateReview = (data) => {
  return reviewSchema.validate(data);
};

module.exports = { validateAppointment, validatePartnership, validateReview };
