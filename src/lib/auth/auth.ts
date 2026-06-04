import { betterAuth } from "better-auth";
import prisma from "@/lib/db/prisma";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin as adminPlugin,
  organization,
  twoFactor,
} from "better-auth/plugins";
import {
  ac,
  admin,
  instructor,
  superAdmin,
  user,
} from "@/lib/auth/permissions";

import { sendExistingUserEmail } from "../emails/send-existing-user-email";
import { sendPasswordResetEmail } from "../emails/send-password-reset-email";
import { sendEmailVerificationEmail } from "../emails/send-email-verification-email";
import { sendDeleteAccountVerificationEmail } from "../emails/send-delete-account-verification-email";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
// import { sendChangeEmailConfirmationEmail } from "../emails/send-change-email-confirmation-email";

export const auth = betterAuth({
  appName: process.env.APP_NAME,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
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
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
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
  plugins: [
    twoFactor(),
    adminPlugin({
      ac,
      roles: {
        user,
        instructor,
        admin,
        superAdmin,
      },
    }),
    organization({
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        });
      },
    }),
    nextCookies(),
  ],

  databaseHooks: {
    session: {
      create: {
        before: async (userSession) => {
          const membership = await prisma.member.findFirst({
            where: {
              userId: userSession.userId,
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              organizationId: true,
            },
          });

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          };
        },
      },
    },
  },
});
