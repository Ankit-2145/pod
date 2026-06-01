import z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, instructorProcedure } from "@/trpc/init";
import { UTApi } from "uploadthing/server";

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

  getById: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
        include: {
          chapters: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return course;
    }),
  getMany: instructorProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user.role === "admin";

    return ctx.prisma.course.findMany({
      where: isAdmin
        ? {}
        : {
            authorId: ctx.user.id,
          },

      orderBy: {
        createdAt: "desc",
      },
    });
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
  updateShortDescription: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        shortDescription: z.string().min(1).max(200),
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

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          shortDescription: input.shortDescription,
        },
      });
    }),

  updateDescription: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
        description: z.string().min(1, {
          message: "Description is required",
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

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          description: input.description,
        },
      });

      return updatedCourse;
    }),
  updateImage: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
        imageUrl: z.url(),
        imageFileKey: z.string(),
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

      const isOwner = course.authorId === ctx.user.id;
      const isAdmin = ctx.user.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const utapi = new UTApi();

      if (course.imageFileKey) {
        await utapi.deleteFiles(course.imageFileKey);
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },
        data: {
          imageUrl: input.imageUrl,
          imageFileKey: input.imageFileKey,
        },
      });
    }),
  updateCategory: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        categoryId: z.string(),
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

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          categoryId: input.categoryId,
        },
      });
    }),

  updatePrice: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),

        originalPrice: z.number().nullable(),

        price: z.number().nullable(),
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

      const isOwner = course.authorId === ctx.user.id;

      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      if (
        input.price !== null &&
        input.originalPrice !== null &&
        input.price > input.originalPrice
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",

          message: "Discount price cannot be greater than original price",
        });
      }

      return ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          originalPrice: input.originalPrice,

          price: input.price,
        },
      });
    }),

  publish: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
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

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          isPublished: true,
        },
      });

      return updatedCourse;
    }),

  unpublish: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
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

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: input.courseId,
        },

        data: {
          isPublished: false,
        },
      });

      return updatedCourse;
    }),

  delete: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
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

      const isAdmin = ctx.user.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      await ctx.prisma.course.delete({
        where: {
          id: input.courseId,
        },
      });

      return {
        success: true,
      };
    }),
});
