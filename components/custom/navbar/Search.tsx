"use client";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { ArtcleCardProps } from "@/components/custom/blog/ArtcleCard";
import Image from "next/image";
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
const Search = ({ isNavbar }: { isNavbar?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = pathname.startsWith("/search");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ArtcleCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedInputValue = useDebounce(inputValue, 500);
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setInputValue(currentQuery);
    setSearchQuery(currentQuery);
  }, [pathname, searchParams]);
  const updateQueryParam = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("query", query.trim());
    } else {
      params.delete("query");
    }
    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();
    if (newParamsString !== currentParamsString) {
      router.replace(`${pathname}?${newParamsString}`);
    }
  };
  useEffect(() => {
    const trimmedInput = debouncedInputValue.trim();
    if (!isSearchPage && trimmedInput) {
      const fetchSuggestions = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            query: trimmedInput,
            limit: "10",
          });
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/1?${params.toString()}`
          );
          const data = await res.json();
          setResults(data?.success?.blogs || []);
        } catch (err) {
          console.error("Autosuggest error", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSuggestions();
    } else if (!trimmedInput) {
      setResults([]);
    }
  }, [debouncedInputValue, isSearchPage]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setDropdownOpen(true);
  };
  const handleFocus = async () => {
    if (!isSearchPage) {
      setDropdownOpen(true);
      if (!inputValue.trim()) {
        setResults([]);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            query: inputValue.trim(),
            limit: "10",
          });
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/1?${params.toString()}`
          );
          const data = await res.json();
          setResults(data?.success?.blogs || []);
        } catch (err) {
          console.error("Autosuggest error on focus", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }
    }
  };
  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    setSearchQuery(trimmedValue);
    setDropdownOpen(false);
    inputRef.current?.blur();
    if (!trimmedValue) return;
    const params = new URLSearchParams();
    params.set("query", trimmedValue);
    router.push(`/search/1?${params.toString()}`);
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSuggestionClick = (slug: string) => {
    setDropdownOpen(false);
    router.push(`/blog/${slug}`);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (!isSearchPage) {
          setInputValue("");
        }
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchPage]);

  return (
    <div
      ref={containerRef}
      className={cn(
        `${
          isNavbar ? "hidden sm:flex" : "sm:hidden flex"
        } relative w-full max-w-md h-12`
      )}
    >
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        value={inputValue}
        placeholder="Search"
        className="
          w-full h-full pl-4 pr-10 rounded-full bg-white outline-none text-sm
          text-gray-700 placeholder:text-gray-400 font-medium
          focus:bg-white border border-gray-300 focus:border-blue-500 transition
        "
      />
      <button
        onClick={handleSearch}
        className="
          absolute right-0 top-0 h-full px-4 flex items-center justify-center
          rounded-r-full bg-transparent border-l cursor-pointer transition
        "
        aria-label="Search"
      >
        <FiSearch className="text-gray-500" size={16} />
      </button>
      {!isSearchPage && dropdownOpen && (
        <div className="absolute top-full left-0 w-xl z-30 mt-1 shadow-lg rounded-lg overflow-hidden">
          <div className="border bg-white rounded-t-lg">
            <div className="p-4 text-sm text-gray-600">
              Suggestions for:{" "}
              <strong className="text-blue-700 italic">
                {inputValue || "..."}
              </strong>{" "}
            </div>
          </div>
          <div className="bg-white border border-t-0 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center w-full p-4">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : !isSearchPage && dropdownOpen && !inputValue.trim() ? (
              <div className="p-4 text-sm text-gray-400">
                Type a search term to find articles
              </div>
            ) : results.length > 0 ? (
              results.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-b last:border-none"
                  onClick={() => handleSuggestionClick(blog.slug)}
                >
                  <div className="w-14 relative h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={blog.coverImage || "/default-thumbnail.jpg"}
                      alt={blog.title}
                      fill
                      priority={false}
                      sizes="56px"
                      className="object-cover h-auto w-auto"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {blog.description || "No description available."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-400">
                No suggestions found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
