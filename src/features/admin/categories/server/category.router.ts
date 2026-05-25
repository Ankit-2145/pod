import z from "zod";

import { createTRPCRouter, instructorProcedure } from "@/trpc/init";

import { TRPCError } from "@trpc/server";

const categorySchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required",
  }),
});

export const categoryRouter = createTRPCRouter({
  create: instructorProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx.user.role === "admin";

      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const slug = input.name.toLowerCase().trim().replace(/\s+/g, "-");

      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          OR: [
            {
              name: input.name,
            },
            {
              slug,
            },
          ],
        },
      });

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Category already exists",
        });
      }

      return ctx.prisma.category.create({
        data: {
          name: input.name,
          slug,
        },
      });
    }),

  getMany: instructorProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },

      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
  }),

  update: instructorProcedure
    .input(
      z.object({
        categoryId: z.string(),

        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx.user.role === "ADMIN";

      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const slug = input.name.toLowerCase().trim().replace(/\s+/g, "-");

      return ctx.prisma.category.update({
        where: {
          id: input.categoryId,
        },

        data: {
          name: input.name,
          slug,
        },
      });
    }),

  archive: instructorProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx.user.role === "ADMIN";

      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.category.update({
        where: {
          id: input.categoryId,
        },

        data: {
          isActive: false,
        },
      });
    }),
});
