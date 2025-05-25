"use client"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChangeEventHandler, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const Search = () => {
  const [value, setValue] = useState('')
  console.log(value)
  useEffect(() => {
    
  }, [value])
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value)
  }
  return (
    <div className="hidden sm:flex items-center bg-gray-50 rounded-full border border-gray-200 px-3 py-1">
      <FiSearch size={22} className="text-gray-600 mr-2" />
      <Input
        type="text"
        onChange={handleChange}
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
