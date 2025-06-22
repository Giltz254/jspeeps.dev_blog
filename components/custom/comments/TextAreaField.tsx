"use client";

import React, { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FieldErrors,
  Path,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";
interface FormFieldProps<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: Path<T>;
  disabled?: boolean;
  placeholder: string;
  label?: string;
  inputClassNames?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}
const TextAreaFieldInner = <T extends FieldValues>(
  {
    id,
    disabled,
    placeholder,
    label,
    inputClassNames,
    register,
    errors,
    ...rest
  }: FormFieldProps<T>,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) => {
  const { ref: registerRef, ...restRegister } = register(id);
  return (
    <div>
      {label && <span className="block text-sm">{label}</span>}
      <Textarea
        id={id}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        {...restRegister}
        ref={(el) => {
          registerRef(el);
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
          }
        }}
        className={cn(
          "border-0 outline-o resize-none focus-visible:ring-0 shadow-none disabled:opacity-70 disabled:cursor-not-allowed",
          errors[id] && "border-rose-400",
          inputClassNames
        )}
        {...rest}
      />
    </div>
  );
};
const TextAreaField = forwardRef(TextAreaFieldInner) as <T extends FieldValues>(
  props: FormFieldProps<T> & { ref?: React.Ref<HTMLTextAreaElement> }
) => ReturnType<typeof TextAreaFieldInner>;

export default TextAreaField;