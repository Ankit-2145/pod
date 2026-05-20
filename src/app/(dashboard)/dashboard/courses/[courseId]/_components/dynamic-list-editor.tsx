"use client";

import type React from "react";

import { useState } from "react";
import { Trash2, GripVertical, Plus, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

/**
 * Props interface for the DynamicListEditor component
 */
interface DynamicListEditorProps {
  /** Array of items with title and optional description */
  value: { title: string; description?: string }[];
  /** Callback function when the value changes */
  onChange: (value: { title: string; description?: string }[]) => void;
  /** Whether to show description fields */
  withDescription?: boolean;
}

/**
 * DynamicListEditor Component
 *
 * A reusable component for managing a dynamic list of items with title and optional description.
 * Allows adding, editing, and removing items from the list.
 */
export const DynamicListEditor = ({
  value,
  onChange,
  withDescription = false,
}: DynamicListEditorProps) => {
  // Track which item is currently being focused/edited
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  /**
   * Updates a specific field of an item at the given index
   * @param index - The index of the item to update
   * @param key - The field name to update ('title' or 'description')
   * @param val - The new value for the field
   */
  const handleChange = (index: number, key: string, val: string) => {
    const updated = [...value];
    updated[index][key] = val;
    onChange(updated);
  };

  /**
   * Adds a new empty item to the list
   */
  const addItem = () => {
    const newItem = withDescription
      ? { title: "", description: "" }
      : { title: "" };
    const newValue = [...value, newItem];
    onChange(newValue);

    // Focus the new item after it's added (in the next tick)
    setTimeout(() => {
      setFocusedIndex(newValue.length - 1);
    }, 0);
  };

  /**
   * Removes an item at the specified index
   * @param index - The index of the item to remove
   */
  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setFocusedIndex(null);
  };

  /**
   * Handles keyboard navigation between items
   * @param e - Keyboard event
   * @param index - Current item index
   */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Add new item when pressing Enter on the last field of the last item
    if (
      e.key === "Enter" &&
      index === value.length - 1 &&
      (!withDescription ||
        e.currentTarget.getAttribute("name") === "description")
    ) {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-4">
      {/* Empty state message when no items exist */}
      {value.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-md bg-muted/50">
          <AlertCircle className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No items added yet. Click the button below to add your first item.
          </p>
        </div>
      )}

      {/* List of items */}
      <div className="space-y-3">
        {value.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-2 border p-3 rounded-md transition-all",
              focusedIndex === i
                ? "border-primary shadow-sm"
                : "hover:border-muted-foreground/30"
            )}
          >
            {/* Item header with title input and remove button */}
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Label htmlFor={`item-title-${i}`} className="sr-only">
                  Item title
                </Label>
                <Input
                  id={`item-title-${i}`}
                  name="title"
                  placeholder="Enter title"
                  value={item.title}
                  onChange={(e) => handleChange(i, "title", e.target.value)}
                  onFocus={() => setFocusedIndex(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="focus:ring-1 focus:ring-primary"
                  aria-required="true"
                />
              </div>

              <Button
                variant="ghost"
                type="button"
                onClick={() => removeItem(i)}
                className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Optional description field */}
            {withDescription && (
              <div className="pl-7">
                <Label htmlFor={`item-description-${i}`} className="sr-only">
                  Item description
                </Label>
                <Input
                  id={`item-description-${i}`}
                  name="description"
                  placeholder="Enter description"
                  value={item.description || ""}
                  onChange={(e) =>
                    handleChange(i, "description", e.target.value)
                  }
                  onFocus={() => setFocusedIndex(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new item button */}
      <Button
        type="button"
        onClick={addItem}
        variant="outline"
        className="w-full border-dashed hover:border-primary transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {value.length === 0 ? "First" : "Another"} Item
      </Button>
    </div>
  );
};
