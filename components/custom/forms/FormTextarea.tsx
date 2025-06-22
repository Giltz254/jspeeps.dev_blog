"use client"
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { FieldErrors, Path, UseFormRegister, FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type ControlledProps = {
  id: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors?: never;
  register?: never;
};

type RHFProps<T extends FieldValues> = {
  id: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors;
  value?: never;
  onChange?: never;
};

type FormTextareaProps<T extends FieldValues> = ControlledProps | RHFProps<T>;

const FormTextarea = <T extends FieldValues>(props: FormTextareaProps<T>) => {
  const localRef = useRef<HTMLTextAreaElement | null>(null);
  const error =
    "errors" in props && props.errors?.[props.id]
      ? (props.errors[props.id]?.message as string)
      : undefined;
  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const resize = () => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };
    resize();
    el.addEventListener("input", resize);
    return () => el.removeEventListener("input", resize);
  }, []);
  if ("value" in props && "onChange" in props) {
    const { id, label, value, onChange, placeholder, rows = 3, disabled = false } = props;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <Textarea
          id={id}
          ref={localRef}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={disabled}
          className={cn(
            "w-full resize-none border border-gray-300 rounded-md shadow-sm p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
        />
      </div>
    );
  }
  const { id, label, placeholder, rows = 3, disabled = false, register, errors } = props;
  const { ref: hookFormRef, ...fieldProps } = register(id as Path<T>);
  const setRefs = (el: HTMLTextAreaElement | null) => {
    localRef.current = el;
    if (typeof hookFormRef === "function") {
      hookFormRef(el);
    } else if (hookFormRef) {
      (hookFormRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    }
  };
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Textarea
        id={id}
        ref={setRefs}
        rows={rows}
        placeholder={placeholder}
        readOnly={disabled}
        className={cn(
          "w-full resize-none border border-gray-300 rounded-md shadow-sm p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "bg-gray-100 cursor-not-allowed",
          error && "border-rose-500"
        )}
        {...fieldProps}
      />
      {error && <p className="text-sm text-rose-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormTextarea;
