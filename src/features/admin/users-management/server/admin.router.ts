import { auth } from "@/lib/auth/auth";

import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { headers } from "next/headers";

export const adminRouter = createTRPCRouter({
  /**
   * - Retrieves statistics about the users in the system.
   * - Requires admin/super admin privileges to access.
   * - Returns total number of users in the system.
   */
  getStats: adminProcedure.query(async ({ ctx }) => {
    const totalUsers = await ctx.prisma.user.count();

    return {
      totalUsers,
    };
  }),

  /**
   * - Lists users in the system with pagination and sorting options.
   * - Requires admin/super admin privileges to access.
   * - Returns a list of users with their details.
   */
  listUsers: adminProcedure.query(async () => {
    return auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: 20,
        sortBy: "createdAt",
        sortDirection: "asc",
      },
    });
  }),
});
