"use client";

import { ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { BlogSchemaType } from "@/schemas/BlogShema";
import { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";

interface TagInputProps {
  tags?: string[];
  setValue: UseFormSetValue<BlogSchemaType>;
  watch: UseFormWatch<BlogSchemaType>;
  errors: FieldErrors<BlogSchemaType>;
  availableTags?: string[];
}

export default function TagInput({
  tags = [],
  setValue,
  watch,
  errors,
  availableTags = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTags = watch("tags") ?? [];
  const maxTags = 4;

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (
      !trimmed ||
      currentTags.includes(trimmed) ||
      currentTags.length >= maxTags
    ) {
      return;
    }

    setValue("tags", [...currentTags, trimmed], { shouldValidate: true });
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setValue("tags", updated, { shouldValidate: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const filteredSuggestions = availableTags
    .filter(
      (tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !currentTags.includes(tag)
    )
    .slice(0, 5);

  useEffect(() => {
    setShowSuggestions(inputValue.trim() !== "");
  }, [inputValue]);

  return (
    <div className="w-full relative">
      <label className="block text-base font-medium mb-1">
        Tags (maximum of {maxTags})
      </label>

      <div
        className={`w-full relative flex flex-wrap items-center border-b py-1 px-2 transition-colors ${
          errors.tags ? "border-b-rose-400" : "border-b-border"
        } focus-within:border-b-gray-200`}
      >
        {(tags ?? []).map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-base mr-2 mb-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {tags.length < maxTags && (
          <div className="flex-1 min-w-[100px] flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSuggestions((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronDown size={18} />
            </button>

            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag"
              className="border-none shadow-none rounded-none outline-none ring-0 focus-visible:ring-0 px-0 py-0 flex-1"
            />
          </div>
        )}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 shadow-md rounded-md top-full bg-white mt-2 z-10 border border-border max-h-48 overflow-y-auto">
            {filteredSuggestions.map((tag) => (
              <li
                key={tag}
                onClick={() => addTag(tag)}
                className="px-4 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 transition"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {errors.tags && (
        <span className="text-sm text-rose-400">
          {errors.tags.message as string}
        </span>
      )}
    </div>
  );
}
