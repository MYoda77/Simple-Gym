import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard = ({ icon, label, value, unit, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("min-w-[140px] bg-card/50 backdrop-blur-sm border-border/20", className)}>
      <CardContent className="p-4 text-center">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {trend && (
          <div className={cn(
            "text-xs mt-1",
            trend === 'up' && "text-green-500",
            trend === 'down' && "text-red-500",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && '↗️'}
            {trend === 'down' && '↘️'}
            {trend === 'neutral' && '➡️'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};