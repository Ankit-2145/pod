import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  email: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ email, subject, html }: SendEmailParams) => {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject,
    html,
  });
};
