"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISASTER_LABELS, DisasterType } from "@/lib/types";
import { formatCurrency } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DamageCostChartProps {
  data: Record<DisasterType, number>;
}

export function DamageCostChart({ data }: DamageCostChartProps) {
  const chartData = Object.entries(data)
    .map(([key, value]) => ({
      name: DISASTER_LABELS[key as DisasterType],
      value,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Afet Türüne Göre Toplam Hasar (TL)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  `${(value / 1000).toFixed(0)}K`
                }
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Hasar"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
