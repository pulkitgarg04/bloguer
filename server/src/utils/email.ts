import nodemailer from 'nodemailer';

const fromEmail = process.env.EMAIL_FROM || 'no-reply@bloguer.app';

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error('SMTP credentials are not configured');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

export async function sendVerificationEmail(
    to: string,
    name: string,
    token: string
) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(
        token
    )}`;

    const transporter = getTransporter();

    const html = `
        <div style="font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
          <h2>Verify your email</h2>
          <p>Hi ${name || ''}, thanks for signing up for Bloguer.</p>
          <p>Please verify your email by clicking the button below. This link expires in 24 hours.</p>
          <p><a href="${verifyUrl}" style="display:inline-block;background:#ef4444;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Verify Email</a></p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${verifyUrl}</p>
          <p>— The Bloguer Team</p>
        </div>
    `;

    await transporter.sendMail({
        from: fromEmail,
        to,
        subject: 'Verify your email - Bloguer',
        html,
    });
}

export async function sendPasswordResetEmail(
    to: string,
    name: string,
    token: string
) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const transporter = getTransporter();

    const html = `
        <div style="font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
          <h2>Reset your password</h2>
          <p>Hi ${name || ''},</p>
          <p>You requested to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
          <p><a href="${resetUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Reset Password</a></p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${resetUrl}</p>
          <p>If you did not request this, you can ignore this email.</p>
          <p>— The Bloguer Team</p>
        </div>
    `;

    await transporter.sendMail({
        from: fromEmail,
        to,
        subject: 'Reset your password - Bloguer',
        html,
    });
}
