"use client";
import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.replace(/<[^>]+>/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 cursor-pointer right-2 text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
      aria-label="Copy code"
    >
      {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
    </button>
  );
};
export default CopyButton;
