import { AlertTriangle } from "lucide-react";
import React from "react";

interface ErrorBlockProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}
const ErrorBlock: React.FC<ErrorBlockProps> = ({
  title = "Something went wrong",
  message,
  icon,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mt-12 rounded-2xl border border-red-200 bg-red-50 text-red-800 shadow-sm p-6 flex items-start gap-4">
      <div className="mt-1">
        {icon ?? <AlertTriangle className="w-6 h-6 text-red-500" />}
      </div>
      <div>
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorBlock;
