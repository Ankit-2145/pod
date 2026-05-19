"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    icon: "👥",
  },
];

export default function HomePage() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center gap-4 text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Elevate your Learning Experience
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Discover a new way to learn with our innovative online education
            platform. Join us today and unlock your full potential!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              prefetch
              className={buttonVariants({ size: "lg" })}
              href="/courses"
            >
              Explore Courses
            </Link>
            {session?.user ? (
              <Link
                prefetch
                className={buttonVariants({ size: "lg", variant: "outline" })}
                href="/profile"
              >
                Profile
              </Link>
            ) : (
              <Link
                prefetch
                className={buttonVariants({ size: "lg", variant: "outline" })}
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </section>
    </>
  );
}
