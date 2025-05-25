"use client";
import { useEdgeStore } from "@/lib/edgestore";
import { ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface AddCoverProps {
  setUploadedCover: (cover: string) => void;
  replaceUrl?: string;
}

const AddCover = ({ setUploadedCover, replaceUrl }: AddCoverProps) => {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleButtonClick = () => imgRef.current?.click();

  useEffect(() => {
    let isMounted = true;
    const uploadImage = async () => {
      if (!file) return;
      setIsUploading(true);
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: replaceUrl ? { replaceTargetUrl: replaceUrl } : undefined,
        });
        console.log("res>>", res)
        if (isMounted && res.url) {
          setUploadedCover(res.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        if (isMounted) {
          setIsUploading(false);
        }
      }
    };
    uploadImage();
    return () => {
      isMounted = false;
    };
  }, [file]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={imgRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        variant="secondary"
        size="sm"
        disabled={isUploading}
        className="flex items-center gap-2 cursor-pointer"
      >
        {isUploading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <ImageIcon size={16} />
        )}
        <span>{replaceUrl ? "Change cover" : "Add cover"}</span>
      </Button>
    </div>
  );
};

export default AddCover;
