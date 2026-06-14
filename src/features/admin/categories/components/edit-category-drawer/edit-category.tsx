"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CategoryName } from "./category-name";
import { CategoryStatus } from "./category-status";
import { DeleteCategory } from "./delete-category";

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: {
    courses: number;
  };
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function EditCategory({ open, onOpenChange, category }: Props) {
  if (!category) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="ml-auto flex h-screen max-w-2xl flex-col">
        <DrawerHeader className="shrink-0">
          <DrawerTitle>Edit Category</DrawerTitle>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl space-y-4 p-6">
            <CategoryName
              categoryId={category.id}
              initialData={{
                name: category.name,
              }}
              onSuccess={() => onOpenChange(false)}
            />

            <CategoryStatus
              categoryId={category.id}
              isActive={category.isActive}
              onSuccess={() => onOpenChange(false)}
            />

            <DeleteCategory
              categoryId={category.id}
              courseCount={category._count.courses}
              onSuccess={() => onOpenChange(false)}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
