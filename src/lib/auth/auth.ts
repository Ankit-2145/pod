import { betterAuth } from "better-auth";
import prisma from "@/lib/db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendEmailVerificationEmail } from "../emails/send-email-verification-email";

export const auth = betterAuth({
  appName: process.env.APP_NAME,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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
});
