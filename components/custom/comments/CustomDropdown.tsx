"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export default function CustomDropdown({
  onDelete,
  isDeleting,
  showDelete,
}: {
  onDelete: () => void;
  isDeleting?: boolean;
  showDelete?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <MoreVertical size={20} />
      </button>

      {open && (
        <div className="absolute z-50 right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-visible">
          <div className="absolute -top-2 right-4 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-l border-t border-gray-200 dark:border-gray-700" />
          {showDelete && (
            <button
              onClick={() => {
                if (!isDeleting) {
                  onDelete();
                  setOpen(false);
                }
              }}
              disabled={isDeleting}
              className="w-full text-left cursor-pointer px-4 py-2 text-sm text-rose-500 hover:text-rose-700 disabled:cursor-not-allowed"
            >
              Delete response
            </button>
          )}
        </div>
      )}
    </div>
  );
}
