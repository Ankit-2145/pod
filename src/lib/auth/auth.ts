import { betterAuth } from "better-auth";
import prisma from "@/lib/db/prisma";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendExistingUserEmail } from "../emails/send-existing-user-email";
import { sendPasswordResetEmail } from "../emails/send-password-reset-email";
import { sendEmailVerificationEmail } from "../emails/send-email-verification-email";
// import { sendChangeEmailConfirmationEmail } from "../emails/send-change-email-confirmation-email";

export const auth = betterAuth({
  appName: process.env.APP_NAME,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute cache
    },
  },
  advanced: {
    cookiePrefix: "pod-lms",
  },
  user: {
    changeEmail: {
      enabled: true,
      // INFO: For change email, send email is by default enabled in better-auth
      // TODO: implement this in the future if needed (This for sending confirmation email to current email when user tries to change their email)
      // sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
      //   await sendChangeEmailConfirmationEmail({ user, newEmail, url });
      // },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      await sendExistingUserEmail({ user });
    },
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url });
    },
  },
  plugins: [nextCookies()],
});
