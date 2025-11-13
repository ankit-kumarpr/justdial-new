
import nodemailer from 'nodemailer';

const { FROM_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, OTP_EXPIRES_MIN } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: false, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  connectionTimeout: 20000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  ignoreTLS: false,
  requireTLS: false,
  retryDelay: 1000,
  maxRetries: 1,
});

if (process.env.NODE_ENV !== 'production') {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error.message);
        console.log('📧 Email service will still work, but verification failed');
      } else {
        console.log('✅ Email transporter is ready to send messages');
      }
    });
  } else {
    console.log('📧 Email transporter configured (verification skipped in production)');
  }

type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
    text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    console.error('Email environment variables are not fully set. Skipping email send.');
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

type WelcomeTemplateProps = {
    name: string;
    email: string;
    phone: string;
    password?: string;
    customId: string;
}

export function welcomeForAdminTemplate({ name, email, phone, password,customId }: WelcomeTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Gnet E-commerce</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Gnet E-commerce</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333333; margin-top: 0;">Hello ${name},</h2>
                  <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                    You have been added as an administrative staff to Gnet E-commerce. We're excited to have you on board!
                  </p>
                  
                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 25px 0;">
                    <h3 style="color: #333333; margin-top: 0;">Your Login Credentials:</h3>
                    <table cellpadding="8" cellspacing="0" width="100%">
                      <tr style="background-color: #f1f1f1;">
                        <td width="30%" style="font-weight: bold; color: #555;">ID:</td>
                        <td style="color: #333;">${customId}</td>
                      </tr>
                      <tr style="background-color: #f1f1f1;">
                        <td width="30%" style="font-weight: bold; color: #555;">Email:</td>
                        <td style="color: #333;">${email}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #555;">Phone:</td>
                        <td style="color: #333;">${phone}</td>
                      </tr>
                      <tr style="background-color: #f1f1f1;">
                        <td style="font-weight: bold; color: #555;">Password:</td>
                        <td style="color: #333;">${password}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6;">
                    For security reasons, please login and change your password immediately.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Login to Dashboard</a>
                  </div>
                  
                  <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                    If you have any questions, please contact our support team.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                    &copy; ${new Date().getFullYear()} Gnet E-commerce. All rights reserved.
                  </p>
                  <p style="color: #bbbbbb; margin: 10px 0 0 0; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function otpEmailTemplate({ code }: { code: string }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Email Verification</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333333; margin-top: 0;">Verify Your Email</h2>
                  <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                    Thank you for registering with Gnet E-commerce. Use the following OTP code to complete your verification:
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #f8f9fa; padding: 15px 30px; border: 2px dashed #4facfe; border-radius: 8px;">
                      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333333;">${code}</div>
                    </div>
                  </div>
                  
                  <p style="color: #ff6b6b; text-align: center; font-size: 14px;">
                    This code will expire in ${OTP_EXPIRES_MIN || 10} minutes.
                  </p>
                  
                  <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                    If you didn't request this code, please ignore this email or contact support if you have concerns.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                    &copy; ${new Date().getFullYear()} Gnet E-commerce. All rights reserved.
                  </p>
                  <p style="color: #bbbbbb; margin: 10px 0 0 0; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function welcomeForUserTemplate({ name, email, phone, password,customId }: WelcomeTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Gnet E-commerce</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Gnet E-commerce</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333333; margin-top: 0;">Hello ${name},</h2>
                  <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                    Thank you for joining Gnet E-commerce! Your account has been successfully verified and is now active.
                  </p>
                  
                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 25px 0;">
                    <h3 style="color: #333333; margin-top: 0;">Your Account Details:</h3>
                    <table cellpadding="8" cellspacing="0" width="100%">
                      <tr style="background-color: #f1f1f1;">
                        <td width="30%" style="font-weight: bold; color: #555;">ID:</td>
                        <td style="color: #333;">${customId}</td>
                      </tr>
                      <tr style="background-color: #f1f1f1;">
                        <td width="30%" style="font-weight: bold; color: #555;">Email:</td>
                        <td style="color: #333;">${email}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #555;">Phone:</td>
                        <td style="color: #333;">${phone}</td>
                      </tr>
                      <tr style="background-color: #f1f1f1;">
                        <td style="font-weight: bold; color: #555;">Password:</td>
                        <td style="color: #333;">${password}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6;">
                    For your security, we recommend changing your password after your first login.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Shopping</a>
                  </div>
                  
                  <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                    Happy shopping! If you need any assistance, our support team is here to help.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                    &copy; ${new Date().getFullYear()} Gnet E-commerce. All rights reserved.
                  </p>
                  <p style="color: #bbbbbb; margin: 10px 0 0 0; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
