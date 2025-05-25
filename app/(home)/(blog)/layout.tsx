import { EdgeStoreProvider } from "@/lib/edgestore";
import React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EdgeStoreProvider>
      <div>{children}</div>
    </EdgeStoreProvider>
  );
};

export default BlogLayout;
