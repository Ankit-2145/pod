import { sendEmail } from "./send-email";

type sendChangeEmailConfirmationEmailParams = {
  user: { email: string; name: string };
  url: string;
  newEmail?: string;
};

export async function sendChangeEmailConfirmationEmail({
  user,
  url,
  newEmail,
}: sendChangeEmailConfirmationEmailParams) {
  return await sendEmail({
    email: user.email, // sending to OLD email
    subject: "Confirm your email change",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Confirm email change</h2>

        <p>Hi ${user.name},</p>

        <p>
          We received a request to change your account email address 
          ${newEmail ? `to <strong>${newEmail}</strong>` : ""}.
        </p>

        <p>
          Click the button below to confirm this change:
        </p>

        <p style="margin: 20px 0;">
          <a href="${url}" style="
            background-color: #000;
            color: #fff;
            padding: 10px 16px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">
            Confirm Email Change
          </a>
        </p>

        <p style="font-size: 12px; color: #777;">
          If you did not request this change, please ignore this email. Your email will remain unchanged.
        </p>

        <p style="font-size: 12px; color: #777;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
  });
}
