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
          "w-full flex items-center px-4 py-2 bg-gray-100 rounded-full",
          errors[id] && "ring-1 ring-rose-400"
        )}
      >
        {leftIcon && (
          <div className="flex items-center pr-3 mr-3 border-r border-gray-300 text-gray-500 text-sm">
            {leftIcon}
          </div>
        )}

        <Input
          id={id}
          type={isPassword && !showPassword ? "password" : "text"}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent text-sm placeholder:text-gray-400 border-none shadow-none rounded-none outline-none ring-0 focus-visible:ring-0 px-0",
            inputClassNames
          )}
          {...register(id as Path<T>)}
        />

        {isPassword && (
          <div
            className="ml-3 text-gray-500 text-sm cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </div>
        )}
      </div>

      {message && (
        <span className="text-xs text-rose-500 mt-1 block">{message}</span>
      )}
    </div>
  );
};

export default FormField;
