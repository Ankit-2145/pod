"use client";

import { useEffect, useState } from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

interface ChapterItem {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
  isFree?: boolean;
}

interface ChaptersListProps {
  items: ChapterItem[];

  onReorder: (
    updateData: {
      id: string;
      position: number;
    }[],
  ) => Promise<void>;

  onEdit: (id: string) => void;

  isPending?: boolean;
}

export function ChaptersList({
  items,
  onReorder,
  onEdit,
  isPending,
}: ChaptersListProps) {
  const [isMounted, setIsMounted] = useState(false);

  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(chapters);

    const [removed] = reorderedItems.splice(result.source.index, 1);

    reorderedItems.splice(result.destination.index, 0, removed);

    setChapters(reorderedItems);

    const bulkUpdateData = reorderedItems.map((chapter, index) => ({
      id: chapter.id,
      position: index,
    }));

    await onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
                isDragDisabled={isPending}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "flex items-center gap-x-2 rounded-md border border-blue-100 text-sm text-slate-700 transition",
                      isPending && "pointer-events-none opacity-70",
                    )}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className={cn(
                        "rounded-l-md border-r border-r-blue-100 px-2 py-3 transition hover:bg-blue-100",
                        chapter.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200",
                      )}
                    >
                      <Grip className="h-5 w-5" />
                    </div>

                    <p className="line-clamp-1">{chapter.title}</p>

                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.isFree && (
                        <Badge variant="default" className="rounded-full">
                          Free
                        </Badge>
                      )}

                      <Badge
                        className={cn(
                          "rounded-full border-brand bg-transparent text-brand",
                          chapter.isPublished && "bg-brand text-white",
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>

                      <button
                        type="button"
                        onClick={() => onEdit(chapter.id)}
                        className="transition hover:opacity-75"
                        disabled={isPending}
                      >
                        <Pencil className="h-4 w-4 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
