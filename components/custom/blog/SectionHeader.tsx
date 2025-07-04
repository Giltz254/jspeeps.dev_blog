import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon: Icon,
  className = "",
}) => {
  return (
    <div
      className={cn("flex items-center gap-2 mb-2 border-b", className)}
    >
      {Icon && <Icon className="text-orange-500 w-5 h-5" />}

      <div className="relative inline-block">
        <h2 className="text-lg font-semibold first-letter:capitalize text-gray-900 leading-tight pb-2">
          {title}
        </h2>
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-orange-500 rounded-full"></span>
      </div>
    </div>
  );
};

export default SectionHeader;
