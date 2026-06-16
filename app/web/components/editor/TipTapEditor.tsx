"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
  content?: Record<string, unknown>;
  onChange?: (json: Record<string, unknown>, html: string) => void;
  journeyLogId: string;
}

export function TipTapEditor({ content, onChange, journeyLogId }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: "Begin writing your entry...",
      }),
    ],
    content: content && Object.keys(content).length > 0 ? content : "", // Handled empty object gracefully on init
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none px-1 py-2 font-serif text-base focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(
        currentEditor.getJSON() as Record<string, unknown>,
        currentEditor.getHTML()
      );
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed || !content) return;

    if (Object.keys(content).length === 0) return;

    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(content);
    
    if (current !== incoming) {
      queueMicrotask(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(content);
        }
      });
    }
  }, [content, editor]);

  const uploadImage = useCallback(async () => {
    const userId = pb.authStore.model?.id ?? pb.authStore.record?.id;
    if (!pb.authStore.isValid || !userId) {
      alert("Please sign in first");
      return;
    }
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user", userId);
      formData.append("journey_log", journeyLogId);
      formData.append("type", "image");

      console.log("journeyLogId:", journeyLogId);
console.log("token:", pb.authStore.token);
console.log("model:", pb.authStore.model);
console.log("record:", pb.authStore.record);
console.log("isValid:", pb.authStore.isValid);

      try {
  const record = await pb.collection("media").create(formData);
  const url = pb.files.getURL(record, record.file);

  editor.chain().focus().setImage({ src: url }).run();
} catch (err: any) {
  console.error("Upload error:", err);

  if (err.response) {
    console.error(
      "PocketBase response:",
      JSON.stringify(err.response, null, 2)
    );
  }

  alert("Could not upload image. Please try again.");
}
    };
    input.click();
  }, [editor, journeyLogId]);

  if (!editor) {
    return (
      <div className="min-h-[360px] rounded-[8px] border border-black/10 bg-white p-4">
        <p className="text-sm text-text-body">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 px-3 py-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={uploadImage} label="Upload image">
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div className="min-h-[360px] px-5 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-[4px] p-2 text-text-body transition hover:bg-black/[0.04]",
        active && "bg-accent/10 text-accent"
      )}
    >
      {children}
    </button>
  );
}