"use client";

import { updateBlogStatus } from "@/actions/blogs/update-blog-status";
import { useState } from "react";
import { Blog } from "./BlogTable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";

const StatusCell = ({ blog }: { blog: Blog }) => {
  const [checked, setChecked] = useState(blog.status);
  const [loading, setLoading] = useState(false);
  const toggleStatus = async (value: boolean) => {
    setLoading(true);
    setChecked(value);
    try {
      const res = await updateBlogStatus(blog.id, value);
      if (res.success) showSuccessToast(res.success);
      else if (res.error) {
        showErrorToast(res.error);
        setChecked(!value);
      }
    } catch {
      setChecked(!value);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`status-${blog.id}`}
        checked={checked}
        disabled={loading}
        onCheckedChange={toggleStatus}
      />
      <Label htmlFor={`status-${blog.id}`}>
        {checked ? "Published" : "Draft"}
      </Label>
    </div>
  );
};

export default StatusCell;
