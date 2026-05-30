import z from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, instructorProcedure } from "@/trpc/init";

export const chapterRouter = createTRPCRouter({
  create: instructorProcedure
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
          message: "Course not found",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      const lastChapter = await ctx.prisma.chapter.findFirst({
        where: {
          courseId: input.courseId,
        },

        orderBy: {
          position: "desc",
        },
      });

      const newPosition = lastChapter ? lastChapter.position + 1 : 1;

      const chapter = await ctx.prisma.chapter.create({
        data: {
          title: input.title,

          courseId: input.courseId,

          position: newPosition,
        },
      });

      return chapter;
    }),

  reorder: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        list: z.array(
          z.object({
            id: z.string(),

            position: z.number(),
          }),
        ),
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
          message: "Course not found",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      await Promise.all(
        input.list.map((item) =>
          ctx.prisma.chapter.update({
            where: {
              id: item.id,
            },

            data: {
              position: item.position,
            },
          }),
        ),
      );

      return {
        success: true,
      };
    }),
});
