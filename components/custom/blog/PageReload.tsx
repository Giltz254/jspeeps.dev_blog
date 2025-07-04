"use client";

import ReusableButton from "../forms/ReusableButton";

const PageReload = () => {
  return (
    <ReusableButton
      onClick={() => window.location.reload()}
      type="button"
      label="retry"
      className="rounded-full"
    />
  );
};

export default PageReload;
