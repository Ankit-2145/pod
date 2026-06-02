import z from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, instructorProcedure } from "@/trpc/init";
import { UTApi } from "uploadthing/server";

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

      const isAdmin = ctx.user.role === "admin";

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
  getById: instructorProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findFirst({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },

        include: {
          attachments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }

      return chapter;
    }),
  updateTitle: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }

      if (chapter.course.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return await ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          title: input.title,
        },
      });
    }),
  updateDescription: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (chapter.course.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          description: input.description,
        },
      });
    }),
  updateAccess: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
        isFree: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (chapter.course.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          isFree: input.isFree,
        },
      });
    }),
  updateVideoUrl: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
        videoUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        ctx.user.role !== "admin" &&
        chapter.course.authorId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          videoUrl: input.videoUrl,
        },
      });
    }),
  createAttachment: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
        url: z.url(),
        name: z.string().min(1),
        fileKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        chapter.course.authorId !== ctx.user.id &&
        ctx.user.role !== "ADMIN"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.attachment.create({
        data: {
          chapterId: input.chapterId,
          url: input.url,
          name: input.name,
          fileKey: input.fileKey,
        },
      });
    }),

  deleteAttachment: instructorProcedure
    .input(
      z.object({
        attachmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const utapi = new UTApi();

      const attachment = await ctx.prisma.attachment.findUnique({
        where: {
          id: input.attachmentId,
        },
        include: {
          chapter: {
            include: {
              course: {
                select: {
                  authorId: true,
                },
              },
            },
          },
        },
      });

      if (!attachment) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        attachment.chapter?.course.authorId !== ctx.user.id &&
        ctx.user.role !== "ADMIN"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      await utapi.deleteFiles(attachment.fileKey);

      return ctx.prisma.attachment.delete({
        where: {
          id: input.attachmentId,
        },
      });
    }),

  publish: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = chapter.course.authorId === ctx.user.id;
      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          isPublished: true,
        },
      });
    }),
  unpublish: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = chapter.course.authorId === ctx.user.id;
      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          isPublished: false,
        },
      });
    }),
  delete: instructorProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isOwner = chapter.course.authorId === ctx.user.id;
      const isAdmin = ctx.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.chapter.delete({
        where: {
          id: input.chapterId,
        },
      });
    }),
});
