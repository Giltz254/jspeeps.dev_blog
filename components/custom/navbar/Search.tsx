"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const Search = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setValue(currentQuery);
  }, [searchParams]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (pathname === "/search") {
        const newParams = new URLSearchParams(window.location.search);
        if (trimmed) {
          newParams.set("query", trimmed);
          window.history.replaceState(null, "", `/search?${newParams.toString()}`);
        } else {
          newParams.delete("query");
          window.history.replaceState(null, "", `/search${newParams.toString() ? `?${newParams.toString()}` : ''}`);
        }
      } else if (trimmed) {
        router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      }
      e.currentTarget.blur();
    }
  };

  return (
    <div className="hidden sm:flex items-center bg-gray-50 rounded-full border border-gray-200 px-3 py-1">
      <FiSearch size={22} className="text-gray-600 mr-2" />
      <Input
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        placeholder="Search"
        className={cn(
          "focus:bg-white bg-white placeholder:font-medium rounded-full"
        )}
      />
    </div>
  );
};

export default Search;