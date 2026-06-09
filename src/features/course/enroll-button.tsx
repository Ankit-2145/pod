"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { formatPrice } from "@/lib/course/format";
import { cn } from "@/lib/utils";

interface CourseEnrollButtonProps {
  courseId: string;
  price?: number;
  isPurchased?: boolean;
  className?: string;
}

export function CourseEnrollButton({
  courseId,
  price,
  isPurchased = false,
  className,
}: CourseEnrollButtonProps) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const createCheckout = useMutation(
    trpc.course.createCheckout.mutationOptions(),
  );

  const verifyPayment = useMutation(
    trpc.course.verifyPayment.mutationOptions(),
  );

  const isPending = createCheckout.isPending || verifyPayment.isPending;

  // Purchased users should go directly to the course
  if (isPurchased) {
    return (
      <Button
        onClick={() => router.push(`/courses/${courseId}`)}
        className={cn("w-full", className)}
      >
        Continue Learning
      </Button>
    );
  }

  const onEnroll = async () => {
    try {
      const checkout = await createCheckout.mutateAsync({
        courseId,
      });

      const razorpay = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: checkout.amount,
        currency: checkout.currency,
        order_id: checkout.orderId,

        name: "Your LMS",
        description: checkout.course.title,

        prefill: {
          name: checkout.user.name,
          email: checkout.user.email,
        },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await verifyPayment.mutateAsync({
            courseId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          await queryClient.invalidateQueries();

          toast.success("Enrollment successful");

          router.push(`/courses/${courseId}`);
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
          },
        },
      });

      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <Button
      onClick={onEnroll}
      disabled={isPending}
      className={cn("w-full", className)}
    >
      {isPending ? (
        "Processing..."
      ) : (
        <>
          Buy Now
          {price && <> • {formatPrice(price)}</>}
        </>
      )}
    </Button>
  );
}
