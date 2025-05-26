import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  FieldErrors,
  Path,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface FormFieldProps<T extends FieldValues> {
  id: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  inputClassNames?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors;
  leftIcon?: React.ReactNode;
}

const FormField = <T extends FieldValues>({
  id,
  type = "text",
  disabled,
  placeholder,
  label,
  inputClassNames,
  register,
  errors,
  leftIcon,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const message = errors[id] && (errors[id]?.message as string);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1">{label}</label>}

      <div
        className={cn(
          "w-full flex items-center border-b py-1 px-2 transition-colors focus-within:border-b-black",
          errors[id] ? "border-b-rose-400" : "border-b-border"
        )}
      >
        {leftIcon && (
          <div className="text-gray-500 mr-2 flex-shrink-0">{leftIcon}</div>
        )}

        <Input
          id={id}
          type={isPassword && !showPassword ? "password" : "text"}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "flex-1 border-none shadow-none rounded-none outline-none ring-0 focus-visible:ring-0 px-0 disabled:opacity-70 disabled:cursor-not-allowed",
            inputClassNames
          )}
          {...register(id as Path<T>)}
        />

        {isPassword && (
          <div
            className="ml-2 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </div>
        )}
      </div>

      {message && <span className="text-sm text-rose-400">{message}</span>}
    </div>
  );
};

export default FormField;
