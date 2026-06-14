import z from "zod";
import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  createTRPCRouter,
  instructorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { UTApi } from "uploadthing/server";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";
import {
  courseDetailsProcedure,
  courseOwnerProcedure,
} from "@/trpc/procedures/course-procedures";

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

  getPublicCourseDetails: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user;

      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
          isPublished: true,
        },

        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },

          chapters: {
            where: {
              isPublished: true,
            },

            orderBy: {
              position: "asc",
            },

            select: {
              id: true,
              title: true,
              position: true,
              isFree: true,
            },
          },

          purchases: user
            ? {
                where: {
                  userId: user.id,
                },

                select: {
                  id: true,
                },
              }
            : false,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const isPurchased = user ? course.purchases.length > 0 : false;

      const canManage =
        !!user &&
        (user.role === "admin" ||
          user.role === "superAdmin" ||
          course.authorId === user.id);

      const hasAccess = isPurchased || canManage;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        price: course.price,

        author: course.author,

        category: course.category,

        chapters: course.chapters,

        totalChapters: course.chapters.length,

        isPurchased,

        canManage,

        hasAccess,
      };
    }),

  getById: courseDetailsProcedure.query(({ ctx }) => {
    return ctx.course;
  }),
  getEnrolledCourses: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.course.findMany({
      where: {
        purchases: {
          some: {
            userId: ctx.user.id,
          },
        },
        isPublished: true,
      },

      include: {
        author: {
          select: {
            name: true,
          },
        },

        _count: {
          select: {
            chapters: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getInstructorCourses: instructorProcedure.query(async ({ ctx }) => {
    return ctx.prisma.course.findMany({
      where: {
        authorId: ctx.user.id,
      },

      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllCourses: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.course.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        _count: {
          select: {
            chapters: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getDashboardCourses: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId, role } = ctx.user;

    const baseInclude = {
      _count: {
        select: {
          chapters: true,
        },
      },
    };

    if (role === "admin" || role === "superAdmin") {
      return ctx.prisma.course.findMany({
        include: {
          ...baseInclude,

          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (role === "instructor") {
      return ctx.prisma.course.findMany({
        where: {
          authorId: userId,
        },

        include: baseInclude,

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return ctx.prisma.course.findMany({
      where: {
        purchases: {
          some: {
            userId,
          },
        },

        isPublished: true,
      },

      include: {
        ...baseInclude,

        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  updateTitle: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string().min(1, {
          message: "Title is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
  updateShortDescription: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
        shortDescription: z.string().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },
        data: {
          shortDescription: input.shortDescription,
        },
      });
    }),

  updateDescription: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
        description: z.string().min(1, {
          message: "Description is required",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },
        data: {
          description: input.description,
        },
      });
    }),
  updateImage: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
        imageUrl: z.url(),
        imageFileKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const utapi = new UTApi();

      if (ctx.course.imageFileKey) {
        await utapi.deleteFiles(ctx.course.imageFileKey);
      }

      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },
        data: {
          imageUrl: input.imageUrl,
          imageFileKey: input.imageFileKey,
        },
      });
    }),
  updateCategory: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },
        data: {
          categoryId: input.categoryId,
        },
      });
    }),

  updatePrice: courseOwnerProcedure
    .input(
      z
        .object({
          courseId: z.string(),
          originalPrice: z.number().nullable(),
          price: z.number().nullable(),
        })
        .refine(
          (data) =>
            data.price === null ||
            data.originalPrice === null ||
            data.price <= data.originalPrice,
          {
            message: "Discount price cannot be greater than original price",
            path: ["price"],
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },
        data: {
          originalPrice: input.originalPrice,
          price: input.price,
        },
      });
    }),

  publish: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },

        data: {
          isPublished: true,
        },
      });
    }),

  unpublish: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.course.update({
        where: {
          id: ctx.course.id,
        },

        data: {
          isPublished: false,
        },
      });
    }),

  delete: courseOwnerProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      if (ctx.course.isPublished) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unpublish the course before deleting it",
        });
      }

      await ctx.prisma.course.delete({
        where: {
          id: ctx.course.id,
        },
      });
    }),

  getPublished: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;

    const courses = await ctx.prisma.course.findMany({
      where: {
        isPublished: true,
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        chapters: {
          where: {
            isPublished: true,
          },

          select: {
            id: true,
          },
        },

        purchases: user
          ? {
              where: {
                userId: user.id,
              },

              select: {
                id: true,
              },
            }
          : false,

        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return courses.map(({ purchases, chapters, ...course }) => ({
      ...course,

      totalChapters: chapters.length,

      isPurchased: user ? purchases.length > 0 : false,

      canManage:
        !!user &&
        (user.role === "admin" ||
          user.role === "superAdmin" ||
          course.authorId === user.id),
    }));
  }),

  createCheckout: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
          isPublished: true,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const purchase = await ctx.prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: input.courseId,
          },
        },
      });

      if (purchase) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already purchased",
        });
      }

      const firstChapter = await ctx.prisma.chapter.findFirst({
        where: {
          courseId: course.id,
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
        },
      });

      if (!firstChapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No published chapters found",
        });
      }

      const order = await razorpay.orders.create({
        amount: Math.round(course.price! * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          courseId: course.id,
          userId: user.id,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,

        course: {
          id: course.id,
          title: course.title,
        },

        firstChapterId: firstChapter.id,

        user: {
          name: user.name ?? "Student",
          email: user.email!,
        },
      };
    }),
  verifyPayment: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
        .digest("hex");

      const isValid = generatedSignature === input.razorpay_signature;

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid payment signature",
        });
      }

      const existingPurchase = await ctx.prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: input.courseId,
          },
        },
      });

      if (existingPurchase) {
        return {
          success: true,
        };
      }

      await ctx.prisma.purchase.create({
        data: {
          userId,
          courseId: input.courseId,
          // razorpayOrderId: input.razorpay_order_id,
          // razorpayPaymentId: input.razorpay_payment_id,
        },
      });

      return {
        success: true,
      };
    }),
});
