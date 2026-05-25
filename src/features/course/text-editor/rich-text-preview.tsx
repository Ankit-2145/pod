"use client";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

interface Props {
  value: string;
}

export function RichTextPreview({ value }: Props) {
  const editor = useEditor({
    editable: false,

    extensions: [StarterKit],

    editorProps: {
      attributes: {
        class: "prose max-w-none dark:prose-invert", // If you remove prose it will become bigger preview
      },
    },

    content: JSON.parse(value),

    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
}
