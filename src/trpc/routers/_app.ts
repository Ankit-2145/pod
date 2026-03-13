import { baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
    // return prisma.user.findMany();
    return {
      id: "1",
      name: "John Doe",
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
