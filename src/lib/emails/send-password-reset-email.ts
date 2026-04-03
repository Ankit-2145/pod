import { sendEmail } from "./send-email";

type sendPasswordResetEmailParams = {
  user: { email: string; name: string };
  url: string;
};

export async function sendPasswordResetEmail({
  user,
  url,
}: sendPasswordResetEmailParams) {
  return sendEmail({
    email: user.email,
    subject: "Pod - Reset your password",
    html: `<div style="
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background-color: #ffffff;
  padding: 0;
  margin: 0;
">
  <!-- Container -->
  <div style="
    max-width: 520px;
    margin: 0 auto;
    background-color: #ffffff;
  ">
    <!-- Header spacing -->
    <div style="height: 60px;"></div>
    
    <!-- Main content -->
    <div style="padding: 0 40px;">
      <!-- Heading -->
      <h1 style="
        font-size: 32px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 32px 0;
        line-height: 1.3;
        letter-spacing: -0.5px;
      ">Reset your password</h1>
      
      <!-- Greeting -->
      <p style="
        font-size: 15px;
        color: #666666;
        margin: 0 0 24px 0;
        line-height: 1.6;
      ">Hi ${user.name},</p>
      
      <!-- Message -->
      <p style="
        font-size: 15px;
        color: #666666;
        margin: 0 0 32px 0;
        line-height: 1.6;
      ">We received a request to reset your password. Click the button below to proceed.</p>
      
      <!-- CTA Button -->
      <div style="margin: 40px 0;">
        <a href="${url}" style="
          display: inline-block;
          background-color: #000000;
          color: #ffffff;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.3px;
          transition: background-color 0.2s ease;
        ">Reset Password</a>
      </div>
      
      <!-- Secondary info -->
      <p style="
        font-size: 13px;
        color: #999999;
        margin: 32px 0 12px 0;
        line-height: 1.6;
      ">This link will expire in 1 hour.</p>
      
      <p style="
        font-size: 13px;
        color: #999999;
        margin: 0;
        line-height: 1.6;
      ">If you didn&apos;t request this, you can safely ignore this email.</p>
    </div>
    
    <!-- Footer spacing -->
    <div style="height: 60px;"></div>
  </div>
</div>
    `,
  });
}
