import React from "react";
import { Home, Calendar, Dumbbell, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Home size={24} />, label: "Home", path: "/" },
  { icon: <Calendar size={24} />, label: "Schedule", path: "/?view=schedule" },
  { icon: <Dumbbell size={24} />, label: "Workouts", path: "/?view=workouts" },
  { icon: <TrendingUp size={24} />, label: "Progress", path: "/progress" },
  { icon: <User size={24} />, label: "Profile", path: "/profile" },
];

export const MobileNav: React.FC = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border md:hidden"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px]",
                  "active:scale-95 active:bg-primary/10",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.icon}
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};
