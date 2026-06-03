"use client";

import Image from "next/image";

interface CourseCardProps {
  title: string;
  imageUrl: string | null;
  chapterCount: number;
}

export function CourseCard({ title, imageUrl, chapterCount }: CourseCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="relative aspect-video">
        <Image
          fill
          alt={title}
          src={imageUrl ?? "/placeholder.jpg"}
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-medium">{title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {chapterCount} chapters
        </p>
      </div>
    </div>
  );
}
