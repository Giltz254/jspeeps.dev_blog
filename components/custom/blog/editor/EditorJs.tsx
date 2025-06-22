"use client";

import React, { useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { getTools } from "./tools";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorJsProps {
  onChange: (blocks: OutputBlockData[]) => void;
  initialData?: OutputData;
  key: number;
}

export default function EditorJs({
  onChange,
  initialData,
  key,
}: EditorJsProps) {
  const ref = useRef<EditorJS | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { edgestore } = useEdgeStore();
  const [editorReady, setEditorReady] = useState(false);

  const uploadImageByFile = async (file: File) => {
    try {
      const res = await edgestore.publicFiles.upload({ file });
      return {
        success: 1,
        file: {
          url: res.url,
        },
      };
    } catch (error) {
      console.error("EdgeStore upload error:", error);
      return {
        success: 0,
        message: "Image upload failed",
      };
    }
  };

  useEffect(() => {
    if (ref.current) return;
    let isMounted = true;

    const init = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const tools = getTools(uploadImageByFile);
      if (!editorRef.current || !isMounted) return;

      const editor = new EditorJS({
        holder: editorRef.current,
        data: initialData || { blocks: [] },
        tools,
        placeholder: "Write something...",
        autofocus: false,
        async onChange(api) {
          const savedData = await api.saver.save();
          onChange(savedData.blocks);
        },
        onReady() {
          setEditorReady(true);
        },
      });

      ref.current = editor;
    };

    init();

    return () => {
      isMounted = false;
      ref.current?.destroy?.();
      ref.current = null;
    };
  }, []);

  return (
    <div key={key} className="border border-border rounded-lg">
      <div className="border-b border-b-border p-4 mb-4">
        <label className="block text-base font-medium text-gray-700">Content editor</label>
      </div>
      {!editorReady && (
        <p className="text-muted-foreground pb-2 px-4">Loading editor...</p>
      )}
      <div
        id="editor"
        ref={editorRef}
        className="pb-4"
      />
    </div>
  );
}
