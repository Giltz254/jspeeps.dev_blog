"use client";

import { useState } from "react";
import { Blog } from "./BlogTable";
import { updateBlogFeatured } from "@/actions/blogs/update-blog-featured";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";

const FeaturedCell = ({ blog }: { blog: Blog }) => {
  const [checked, setChecked] = useState(blog.featured);
  const [loading, setLoading] = useState(false);

  const toggleFeatured = async (value: boolean) => {
    setLoading(true);
    setChecked(value);
    try {
      const res = await updateBlogFeatured(blog.id, value);
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
        id={`featured-${blog.id}`}
        checked={checked}
        disabled={loading}
        onCheckedChange={toggleFeatured}
      />
      <Label htmlFor={`featured-${blog.id}`}>{checked ? "Yes" : "No"}</Label>
    </div>
  );
};

export default FeaturedCell;
