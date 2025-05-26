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
        "inline-flex items-center justify-center border align-middle select-none font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-full hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased",
        className
      )}
    >
      {leftIcon && <div className="mr-2 flex-shrink-0">{leftIcon}</div>}
      {label}
    </Button>
  );
};

export default ReusableButton;
