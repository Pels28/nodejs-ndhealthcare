const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // service: process.env.EMAIL_SERVICE || "gmail",
  host: process.env.EMAIL_SERVICE || "mail.ndhealthcare.net",
  port: 587, // Common SMTP port
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

  const adminEmails = [
    process.env.ADMIN_EMAIL_1 || process.env.EMAIL_USER,  // Primary admin
    process.env.ADMIN_EMAIL_2,                            // Secondary admin
  ].filter(Boolean);

// Email template generator
const generateEmailTemplate = (appointmentDetails, isAdmin = false) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.8;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          text-align: center;
          padding: 30px 0 20px;
          border-bottom: 3px solid #FF6B00;
        }
        .logo {
          height: 150px;
          width: 250px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        h1 {
          color: #FF6B00;
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 1px;
          margin: 0 0 25px;
          text-align: center;
          text-transform: uppercase;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #FF6B00, transparent);
          margin: 25px 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
        }
        .detail-label {
          font-weight: 600;
          width: 120px;
          color: #666;
        }
        .detail-value {
          flex: 1;
        }
        .footer {
          margin-top: 40px;
          font-size: 11px;
          color: #999;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .signature {
          font-style: italic;
          margin-top: 30px;
          text-align: center;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://i.postimg.cc/L8n69hqD/logo.png" alt="ND Healthcare Logo" class="logo">
      </div>
      
      <div class="content">
        <h1>${isAdmin ? "New Appointment" : "Appointment Confirmed"}</h1>
        
        ${
          !isAdmin
            ? `
          <p style="text-align: center;">Dear ${appointmentDetails.name},</p>
          <p style="text-align: center;">Thank you for choosing our care services.</p>
        `
            : `
          <p style="text-align: center;">A new appointment request was submitted:</p>
        `
        }
        
        <div class="divider"></div>
        
        <div class="detail-row">
          <div class="detail-label">Service</div>
          <div class="detail-value">${appointmentDetails.service}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Date</div>
          <div class="detail-value">${new Date(
            appointmentDetails.preferredDate
          ).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Time</div>
          <div class="detail-value">${formatTime(
            appointmentDetails.preferredTime
          )}</div>
        </div>
        
        ${
          appointmentDetails.description
            ? `
          <div class="detail-row">
            <div class="detail-label">Notes</div>
            <div class="detail-value">${appointmentDetails.description}</div>
          </div>
        `
            : ""
        }
        
        ${
          isAdmin
            ? `
          <div class="divider"></div>
          <div class="detail-row">
            <div class="detail-label">Client</div>
            <div class="detail-value">${appointmentDetails.name}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Contact</div>
            <div class="detail-value">${appointmentDetails.phoneNumber}<br>${appointmentDetails.email}</div>
          </div>
        `
            : ""
        }
        
        <div class="divider"></div>
        
        ${
          !isAdmin
            ? `
          <p style="text-align: center; font-size: 14px;">
            Please contact us at least 24 hours in advance<br>
            if you need to reschedule or cancel.
          </p>
        `
            : ""
        }
        
        <div class="signature">
          <p>Warm regards,<br>The ND Healthcare Team</p>
        </div>
        
        <div class="footer">
          <p>ND Healthcare &copy; ${new Date().getFullYear()}</p>
          <p>${
            process.env.COMPANY_ADDRESS ||
            "City Galleria, 4th Floor opposite the Accra Mall off the Spintex Road,"
          }</p>
          <p>${process.env.COMPANY_PHONE || "Phone: 024 823 3368"}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePartnershipEmailTemplate = (
  partnershipDetails,
  isAdmin = false
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.8;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          text-align: center;
          padding: 30px 0 20px;
          border-bottom: 3px solid #FF6B00;
        }
        .logo {
          height: 150px;
          width: 200px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        h1 {
          color: #FF6B00;
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 1px;
          margin: 0 0 25px;
          text-align: center;
          text-transform: uppercase;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #FF6B00, transparent);
          margin: 25px 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
        }
        .detail-label {
          font-weight: 600;
          width: 120px;
          color: #666;
        }
        .detail-value {
          flex: 1;
        }
        .footer {
          margin-top: 40px;
          font-size: 11px;
          color: #999;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .signature {
          font-style: italic;
          margin-top: 30px;
          text-align: center;
          color: #555;
        }
        .highlight-box {
          background-color: #FFF8F2;
          border-left: 4px solid #FF6B00;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://i.postimg.cc/L8n69hqD/logo.png" alt="ND Healthcare Logo" class="logo">
      </div>
      
      <div class="content">
        <h1>${
          isAdmin ? "New Partnership Request" : "Partnership Request Received"
        }</h1>
        
        ${
          !isAdmin
            ? `
          <p style="text-align: center;">Dear ${partnershipDetails.name},</p>
          <p style="text-align: center;">Thank you for your interest in partnering with ND Healthcare.</p>
          <div class="highlight-box">
            <p style="text-align: center; margin: 0;">We've received your request and will review it shortly. Our team will contact you within 3-5 business days.</p>
          </div>
        `
            : `
          <p style="text-align: center;">A new partnership request was submitted:</p>
        `
        }
        
        <div class="divider"></div>
        
        <div class="detail-row">
          <div class="detail-label">Full Name</div>
          <div class="detail-value">${partnershipDetails.name}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Institution</div>
          <div class="detail-value">${partnershipDetails.institution}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Role</div>
          <div class="detail-value">${partnershipDetails.role}</div>
        </div>
        
        <div class="divider"></div>
        
        ${
          isAdmin
            ? `
          <div class="detail-row">
            <div class="detail-label">Contact</div>
            <div class="detail-value">
              ${partnershipDetails.phoneNumber}<br>
              ${partnershipDetails.email}
            </div>
          </div>
          <div class="divider"></div>
          <p style="text-align: center; font-size: 14px;">
            Please follow up with this potential partner within 3 business days.
          </p>
        `
            : `
          <p style="text-align: center; font-size: 14px;">
            If you have any questions in the meantime, feel free to contact us.
          </p>
        `
        }
        
        <div class="signature">
          <p>Warm regards,<br>The ND Healthcare Team</p>
        </div>
        
        <div class="footer">
          <p>ND Healthcare &copy; ${new Date().getFullYear()}</p>
          <p>${"City Galleria, 4th Floor opposite the Accra Mall off the Spintex Road,"}</p>
          <p>${"Phone: 024 823 3368"}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateReviewAdminTemplate = (reviewDetails) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.8;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          text-align: center;
          padding: 30px 0 20px;
          border-bottom: 3px solid #FF6B00;
        }
        .logo {
          height: 150px;
          width: 250px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        h1 {
          color: #FF6B00;
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 1px;
          margin: 0 0 25px;
          text-align: center;
          text-transform: uppercase;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #FF6B00, transparent);
          margin: 25px 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
        }
        .detail-label {
          font-weight: 600;
          width: 120px;
          color: #666;
        }
        .detail-value {
          flex: 1;
        }
        .footer {
          margin-top: 40px;
          font-size: 11px;
          color: #999;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .signature {
          font-style: italic;
          margin-top: 30px;
          text-align: center;
          color: #555;
        }
        .review-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 15px;
          display: block;
        }
        .rating-stars {
          color: #FF6B00;
          font-size: 18px;
          letter-spacing: 2px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://i.postimg.cc/L8n69hqD/logo.png" alt="ND Healthcare Logo" class="logo">
      </div>
      
      <div class="content">
        <h1>New Review Submitted</h1>
        <p style="text-align: center;">A new review has been submitted by a client:</p>
        
        ${reviewDetails.image ? `
          <img src="${reviewDetails.image}" alt="Reviewer Avatar" class="review-avatar">
        ` : ''}
        
        <div class="divider"></div>
        
        <div class="detail-row">
          <div class="detail-label">Name</div>
          <div class="detail-value">${reviewDetails.name}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Location</div>
          <div class="detail-value">${reviewDetails.location}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Rating</div>
          <div class="detail-value rating-stars">
            ${'★'.repeat(reviewDetails.rating)}${'☆'.repeat(5 - reviewDetails.rating)}
            (${reviewDetails.rating}/5)
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="detail-row" style="display: block;">
          <div class="detail-label">Review</div>
          <div class="detail-value" style="margin-top: 10px; font-style: italic;">
            "${reviewDetails.comment}"
          </div>
        </div>
        
        <div class="divider"></div>
        <p style="text-align: center; font-size: 14px;">
          This review will be visible on the website after approval.
        </p>
        
        <div class="signature">
          <p>Warm regards,<br>The ND Healthcare Team</p>
        </div>
        
        <div class="footer">
          <p>ND Healthcare &copy; ${new Date().getFullYear()}</p>
          <p>${"City Galleria, 4th Floor opposite the Accra Mall off the Spintex Road,"}</p>
          <p>${"Phone: 024 823 3368"}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper function to format time
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  return `${hour > 12 ? hour - 12 : hour}:${minutes} ${
    hour >= 12 ? "PM" : "AM"
  }`;
};

// Send to Client
const sendClientConfirmation = async (appointmentDetails) => {
  const mailOptions = {
    from: `ND Healthcare <${process.env.EMAIL_USER}>`,
    to: appointmentDetails.email,
    subject: `Your Appointment Confirmation - ${appointmentDetails.service}`,
    html: generateEmailTemplate(appointmentDetails),
  };
  await transporter.sendMail(mailOptions);
};

// Send to Admin
const sendAdminNotification = async (appointmentDetails) => {
  const mailOptions = {
    from: `ND Healthcare Website <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Appointment: ${appointmentDetails.service} - ${appointmentDetails.name}`,
    html: generateEmailTemplate(appointmentDetails, true),
  };
  await transporter.sendMail(mailOptions);
};

const sendPartnerConfirmation = async (partnershipDetails) => {
  const mailOptions = {
    from: `ND Healthcare <${process.env.EMAIL_USER}>`,
    to: partnershipDetails.email,
    subject: `Your Partnership Request with ND Healthcare`,
    html: generatePartnershipEmailTemplate(partnershipDetails),
  };
  await transporter.sendMail(mailOptions);
};

// Send to Admin
const sendPartnerAdminNotification = async (partnershipDetails) => {
  const mailOptions = {
    from: `ND Healthcare Website <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Partnership Request: ${partnershipDetails.institution} - ${partnershipDetails.name}`,
    html: generatePartnershipEmailTemplate(partnershipDetails, true),
  };
  await transporter.sendMail(mailOptions);
};

const sendReviewAdminNotification = async (reviewDetails) => {
  const mailOptions = {
    from: `ND Healthcare Website <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Review: ${reviewDetails.name} (${reviewDetails.rating}★) - ${reviewDetails.location}`,
    html: generateReviewAdminTemplate(reviewDetails),
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendClientConfirmation,
  sendAdminNotification,
  sendPartnerConfirmation,
  sendPartnerAdminNotification,
  sendReviewAdminNotification
};
