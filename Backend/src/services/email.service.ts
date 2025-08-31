import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import config from '../config/config.js';
import { logger } from '../config/logger.js';

const transport: Transporter = nodemailer.createTransport(config.email.smtp as SendMailOptions);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    );
}

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const msg: SendMailOptions = {
    from: config.email.from,
    to,
    subject,
    text
  };

  const res = await transport.sendMail(msg);
  console.log(res, 'RESPONSE EMAIL');
};

const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}`;
  // const resetPasswordUrl = `http://localhost:5500/reset-password?tokens=${encodeURIComponent(token)}`;
  const resetPasswordUrl = `http://localhost:5500/reset-password`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;

  await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${config.FE}/v1/auth/verify-email`;
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Verify Your Email - Brongz Todo',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Montserrat', Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h2 {
            font-size: 24px;
            font-weight: 700;
            color: #2c3e50;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            background-color: #3498db;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin: 20px auto;
            display: block;
            width: fit-content;
          }
          .quote {
            font-size: 18px;
            font-style: italic;
            color: #7f8c8d;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Verification Your Email</h2>
          <p>Click the button below to verify your email address for Brongz-Todo.</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>If you did not create an account, please ignore this email.</p>
          <div class="quote">"A list of tasks you need, without the hassle you don't want.!"</div>
        </div>
      </body>
      </html>
    `
  };
  await transport.sendMail(mailOptions);
};

export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail
};
