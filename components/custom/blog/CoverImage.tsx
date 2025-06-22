"use client";
import Image from "next/image";
import React from "react";
import AddCover from "./AddCover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";

interface CoverImageProps {
  setUploadedCover: (cover: string | undefined) => void;
  url: string;
  isEditor?: boolean;
  isEdit?: boolean;
}
const CoverImage = ({
  setUploadedCover,
  url,
  isEditor,
  isEdit,
}: CoverImageProps) => {
  const { edgestore } = useEdgeStore();
  const handleRemoveCover = async (url: string) => {
    try {
      await edgestore.publicFiles.delete({ url });
      setUploadedCover(undefined);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="relative w-full lg:h-96 h-72 border overflow-hidden group">
      <Image
        src={url}
        fill
        alt="Cover image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
      />
      {isEditor && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-md shadow-md">
          <AddCover setUploadedCover={setUploadedCover} replaceUrl={url} />
          <Button
            onClick={() => handleRemoveCover(url)}
            size="sm"
            variant="destructive"
            className="flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <X size={16} />
            <span>Remove</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoverImage;
