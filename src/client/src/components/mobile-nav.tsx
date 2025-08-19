import { FileText, RotateCcw, Trophy, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
  const navItems = [
    { id: "append", label: "Append", icon: FileText },
    { id: "review", label: "Review", icon: RotateCcw },
    { id: "ranking", label: "Ranking", icon: Trophy },
    { id: "archive", label: "Archive", icon: Archive },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              data-testid={`nav-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
