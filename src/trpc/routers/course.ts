import { z } from "zod";
import { TRPCError } from "@trpc/server";

import prisma from "@/lib/db/prisma";

import { createTRPCRouter, protectedProcedure } from "../init";

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.session.userId;

        const course = await prisma.course.create({
          data: {
            userId,
            title: input.title,
            description: input.description,
          },
        });

        return course;
      } catch (error) {
        console.log("[COURSE_CREATE]", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create course",
        });
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.session.userId;

        const course = await prisma.course.findFirst({
          where: {
            id: input.id,
            userId,
          },

          //   include: {
          //     chapters: {
          //       orderBy: {
          //         position: "asc",
          //       },
          //     },
          //   },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        return course;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  updateTitle: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.session.userId;

      const existingCourse = await prisma.course.findFirst({
        where: {
          id: input.courseId,
          userId,
        },
      });

      if (!existingCourse) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          title: input.title,
        },
      });
    }),
});
