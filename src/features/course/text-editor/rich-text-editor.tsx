"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "./menubar";

import { ControllerRenderProps } from "react-hook-form";

interface RichTextEditorProps {
  field: ControllerRenderProps<
    {
      description: string;
    },
    "description"
  >;
}

export const RichTextEditor = ({ field }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-0 focus:outline-none dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value
      ? JSON.parse(field.value)
      : {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        },

    immediatelyRender: false,
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
