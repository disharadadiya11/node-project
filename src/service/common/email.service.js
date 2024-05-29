const nodemailer = require("nodemailer");
const {
  ErrorExceptionWithResponse,
} = require("../../exception/error.exception");

module.exports = class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(to, subject, body) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_TITLE}" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: body,
      });
      return info;
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.BAD_REQUEST,
        true,
        error.message || MSG.INTERNAL_SERVER_ERROR
      );
    }
  }
};
