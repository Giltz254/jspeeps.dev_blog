"use client";

import ReusableButton from "../forms/ReusableButton";

const HistoryButton = () => {
  return (
    <ReusableButton
      onClick={() => window.history.back()}
      label="Go Back"
      className="rounded-full"
    />
  );
};

export default HistoryButton;
