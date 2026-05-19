import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db/prisma";
import { TRPCError } from "@trpc/server";
export const appRouter = createTRPCRouter({
  creation: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.session.id;
        // const role = ctx.auth.user.role;

        // if (role !== "Admin") {
        //   throw new TRPCError({
        //     code: "FORBIDDEN",
        //     message: "Forbidden",
        //   });
        // }

        const course = await prisma.course.create({
          data: {
            userId,
            title: input.title,
          },
        });

        return course;
      } catch (error) {
        console.log("[COURSE_CREATE]", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error",
        });
      }
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
