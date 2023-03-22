const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");
// const Prisma = require("@prisma/client");
// const {emailConfig} = require("../emailConfig");

// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//       user: 'percy.cormier@ethereal.email',
//       pass: 'ctsScWEFtZ4Dvs3Yus'
//   }
// });

// send email

// module.exports = sendEmail;

// async function sendEmail({ from, to, subject, html }) {
//     const transporter = nodemailer.createTransport(config.smtpOptions);
//     await transporter.sendMail({ from, to, subject, html });
// }

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sarvaiyasarthak.aimsinfosoft@gmail.com",
    pass: "oztalafbvtjxlyhy",
  },
});

async function send(template, subject) {
  // Generate HTML template based on the template string
  const html = pug.renderFile(`${__dirname}/resetPassword.pug`, {
    firstName: template.firstName,
    subject,
    url: subject,
  });
  // Create mailOptions

  // Send email
  let mailDetails = {
    from: "sarvaiyasarthak.aimsinfosoft@gmail.com",
    to: `${template.email}`,
    subject: "Test mail",
    html: convert(html),
    html,
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

async function sendVerificationCode() {
  await this.send("verificationCode", "Your account verification code");
}

async function sendPasswordResetToken() {
  await this.send(
    "resetPassword",
    "Your password reset token (valid for only 10 minutes)"
  );
}

module.exports = {
  send,
  sendPasswordResetToken,
  sendVerificationCode,
};
