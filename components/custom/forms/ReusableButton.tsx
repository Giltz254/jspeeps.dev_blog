"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  leftIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ReusableButton = ({
  label,
  disabled,
  type = "button",
  className,
  leftIcon,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center cursor-pointer justify-center rounded-md px-5 py-2.5 font-medium text-white transition duration-300 ease-in-out shadow-sm hover:shadow-md",
        "bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600",
        "hover:from-slate-600 hover:via-blue-600 hover:to-blue-700",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {leftIcon && <span className="mr-2 flex-shrink-0 text-white/90">{leftIcon}</span>}
      {label}
    </Button>
  );
};

export default ReusableButton;
