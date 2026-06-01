import { auth } from "@/lib/auth/auth";

import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { headers } from "next/headers";

export const adminRouter = createTRPCRouter({
  listUsers: adminProcedure.query(async () => {
    return auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: 100,
        sortBy: "createdAt",
        sortDirection: "asc",
      },
    });
  }),
});
