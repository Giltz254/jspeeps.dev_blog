"use client"
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export function DeleteBlogDialog({ open, setOpen, blog, onDelete }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  blog: { id: string; title: string };
  onDelete: (id: string) => void;
}) {
  const [confirmation, setConfirmation] = useState("");

  const handleConfirm = () => {
    onDelete(blog.id);
    setConfirmation("");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{blog.title}</strong>. Type <strong>delete</strong> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder='Type "delete" to confirm'
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmation("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmation !== "delete"}
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}