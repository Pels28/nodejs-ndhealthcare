const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const formatGhanaianNumber = (rawNumber) => {
  // Remove all non-digit characters
  const cleaned = rawNumber.replace(/\D/g, '');
  
  // Handle numbers starting with 0 (e.g., 054 -> +23354)
  if (cleaned.startsWith('0')) {
    return `+233${cleaned.substring(1)}`;
  }
  
  // Handle numbers without country code
  if (!cleaned.startsWith('233') && cleaned.length === 9) {
    return `+233${cleaned}`;
  }
  
  // Return as-is if already formatted
  return `+${cleaned}`;
};


exports.sendAppointmentSMS = async (phoneNumber, appointmentDetails) => {
       const formattedNumber = formatGhanaianNumber(phoneNumber);

  try {
    const message = await client.messages.create({
      body: `ND Healthcare: Your ${appointmentDetails.service} appointment is confirmed for ${new Date(appointmentDetails.preferredDate).toLocaleDateString()} at ${appointmentDetails.preferredTime}. We'll contact you at ${phoneNumber} if needed.`,
      from: twilioPhoneNumber,
      to: formattedNumber
    });
    
    console.log('SMS sent:', message.sid);
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};