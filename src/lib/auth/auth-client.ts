import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  adminClient,
  organizationClient,
} from "better-auth/client/plugins";
import {
  ac,
  admin,
  instructor,
  superAdmin,
  user,
} from "@/lib/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/two-factor";
      },
    }),
    adminClient({
      ac,
      roles: {
        user,
        instructor,
        admin,
        superAdmin,
      },
    }),
    organizationClient(),
  ],
});
