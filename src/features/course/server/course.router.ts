import z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, instructorProcedure } from "@/trpc/init";

export const courseRouter = createTRPCRouter({
  create: instructorProcedure
    .input(
      z.object({
        title: z.string().min(1, {
          message: "Title is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const course = await ctx.prisma.course.create({
        data: {
          userId,
          authorId: userId,
          title: input.title,
        },
      });

      return course;
    }),

  updateTitle: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        title: z.string().min(1, {
          message: "Title is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isInstructor = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isInstructor && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          title: input.title,
        },
      });

      return updatedCourse;
    }),
});
