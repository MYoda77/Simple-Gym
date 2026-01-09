import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProgressData, ChartPeriod, ChartType } from "@/types/progress";
import { subDays, isAfter, parseISO, format } from "date-fns";

interface ProgressChartsProps {
  data: ProgressData;
}

export const ProgressCharts = ({ data }: ProgressChartsProps) => {
  const [period, setPeriod] = useState<ChartPeriod>("month");
  const [activeChart, setActiveChart] = useState<ChartType>("weight");

  const chartConfig = {
    weight: {
      title: "Weight Progress",
      color: "hsl(var(--primary))",
      unit: "kg",
    },
    bmi: { title: "BMI Progress", color: "hsl(var(--accent))", unit: "" },
  };

  const filterDataByPeriod = (
    data: { date: string; value: number }[],
    period: ChartPeriod
  ) => {
    const now = new Date();
    let daysBack = 30; // default to month

    switch (period) {
      case "week":
        daysBack = 7;
        break;
      case "month":
        daysBack = 30;
        break;
      case "quarter":
        daysBack = 90;
        break;
      case "year":
        daysBack = 365;
        break;
    }

    const cutoffDate = subDays(now, daysBack);
    return data.filter((item) => isAfter(parseISO(item.date), cutoffDate));
  };

  const getChartData = () => {
    const currentData = data[activeChart] || [];
    // Only filter if the data has the correct structure (value property)
    if (activeChart === "measurements") {
      return [];
    }
    const filteredData = filterDataByPeriod(
      currentData as { date: string; value: number }[],
      period
    );
    // Format dates for display
    return filteredData.map((item) => ({
      ...item,
      date: format(parseISO(item.date), "MMM dd"),
    }));
  };

  return (
    <section className="mb-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {chartConfig[activeChart]?.title || "Progress"}
            </CardTitle>
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as ChartPeriod)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeChart}
            onValueChange={(value) => setActiveChart(value as ChartType)}
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-10 p-1 rounded-lg">
              <TabsTrigger
                value="weight"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground transition-all"
              >
                Weight
              </TabsTrigger>
              <TabsTrigger
                value="bmi"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground transition-all"
              >
                BMI
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartConfig[activeChart]?.color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: chartConfig[activeChart]?.color }}
                  activeDot={{
                    r: 6,
                    stroke: chartConfig[activeChart]?.color,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
