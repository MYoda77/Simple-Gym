import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MobileStatCardProps {
  icon?: React.ReactNode;
  emoji?: string;
  value: string | number;
  label: string;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: "default" | "hero" | "gradient";
  className?: string;
  onClick?: () => void;
}

export const MobileStatCard: React.FC<MobileStatCardProps> = ({
  icon,
  emoji,
  value,
  label,
  subtitle,
  trend,
  variant = "default",
  className,
  onClick,
}) => {
  const isHero = variant === "hero";
  const isGradient = variant === "gradient";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "transition-all h-full",
          onClick && "cursor-pointer hover:shadow-lg",
          isHero && "bg-gradient-to-br from-primary/20 to-primary/5",
          isGradient &&
            "bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10",
          className
        )}
        onClick={onClick}
      >
        <CardContent
          className={cn(
            "p-6 flex flex-col justify-between min-h-[140px]",
            isHero && "p-8 min-h-[180px]"
          )}
        >
          {/* Icon/Emoji */}
          {(icon || emoji) && (
            <motion.div
              className="mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {emoji ? (
                <span className="text-4xl">{emoji}</span>
              ) : (
                <div className="text-primary">{icon}</div>
              )}
            </motion.div>
          )}

          {/* Label */}
          <p
            className={cn(
              "text-sm text-muted-foreground mb-2",
              isHero && "text-base"
            )}
          >
            {label}
          </p>

          {/* Value */}
          <div className="flex items-baseline gap-2">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "font-bold tracking-tight",
                isHero ? "text-5xl md:text-6xl" : "text-3xl"
              )}
            >
              {value}
            </motion.p>
            {subtitle && (
              <span
                className={cn(
                  "text-muted-foreground font-normal",
                  isHero ? "text-2xl" : "text-xl"
                )}
              >
                {subtitle}
              </span>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={cn(
                "flex items-center gap-2 mt-3",
                trend.positive ? "text-green-600" : "text-red-600"
              )}
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-lg"
              >
                {trend.positive ? "↗" : "↘"}
              </motion.span>
              <span className="font-semibold">{trend.value}</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface StatGridProps {
  children: React.ReactNode;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {children}
    </div>
  );
};
