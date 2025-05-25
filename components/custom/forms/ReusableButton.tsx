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
  type,
  className,
  leftIcon,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      variant={"secondary"}
      size={"lg"}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(
        "disabled:opacity-70 flex items-center justify-center disabled:cursor-not-allowed w-full duration-300 border border-gray-200 hover:border-gray-300 text-base cursor-pointer rounded-full",
        className
      )}
    >
      {leftIcon && <div className="mr-2 flex-shrink-0">{leftIcon}</div>}
      {label}
    </Button>
  );
};

export default ReusableButton;
