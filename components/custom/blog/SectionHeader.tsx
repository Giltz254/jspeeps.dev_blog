import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, className = "" }) => {
  return (
    <div className={cn("flex items-center gap-2 lg:pl-4 mb-2", className)}>
      {Icon && <Icon className="text-orange-500 w-5 h-5" />}
      <div className="relative">
        <h2 className="text-lg font-medium first-letter:capitalize text-gray-900 leading-tight">
          {title}
        </h2>
        <span
          className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500 transform translate-y-px"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
};

export default SectionHeader;