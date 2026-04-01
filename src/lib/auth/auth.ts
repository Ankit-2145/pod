import { betterAuth } from "better-auth";
import prisma from "@/lib/db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendEmailVerificationEmail } from "../emails/send-email-verification-email";
import { nextCookies } from "better-auth/next-js";

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
  plugins: [nextCookies()],
});
