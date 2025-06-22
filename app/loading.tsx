import Loader from "@/components/custom/Loader";
import React from "react";

const loading = () => {
  return (
    <div className="w-full bg-accent min-h-[calc(100vh-128px)]">
      <Loader />
    </div>
  );
};

export default loading;
