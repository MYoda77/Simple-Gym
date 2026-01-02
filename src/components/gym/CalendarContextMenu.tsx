import React, { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";

interface CalendarContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onUnschedule: () => void;
  workoutName?: string;
}

const CalendarContextMenu: React.FC<CalendarContextMenuProps> = ({
  visible,
  x,
  y,
  onClose,
  onUnschedule,
  workoutName,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] rounded-lg border border-border/50 bg-popover/95 backdrop-blur-sm p-1 shadow-lg"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {/* Header */}
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-border/50">
        {workoutName || "Scheduled Item"}
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <button
          onClick={() => {
            onUnschedule();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
        >
          <Trash2 className="w-4 h-4" />
          <span>Unschedule</span>
        </button>
      </div>

      {/* Footer hint */}
      <div className="px-2 py-1.5 text-xs text-muted-foreground border-t border-border/50">
        Press <kbd className="px-1 rounded bg-muted">Esc</kbd> to close
      </div>
    </div>
  );
};

export default CalendarContextMenu;
