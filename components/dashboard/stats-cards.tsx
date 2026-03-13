"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  MapPin, 
  TrendingDown,
  FileCheck
} from "lucide-react";
import { formatCurrency } from "@/lib/store";

interface StatsCardsProps {
  totalRecords: number;
  totalDamage: number;
  totalAffectedArea: number;
  pendingRecords: number;
}

export function StatsCards({ 
  totalRecords, 
  totalDamage, 
  totalAffectedArea,
  pendingRecords 
}: StatsCardsProps) {
  const stats = [
    {
      name: "Toplam Kayıt",
      value: totalRecords.toString(),
      icon: AlertTriangle,
      description: "Kayıtlı hasar bildirimi",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      name: "Toplam Hasar",
      value: formatCurrency(totalDamage),
      icon: TrendingDown,
      description: "Hesaplanan zarar",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      name: "Etkilenen Alan",
      value: `${totalAffectedArea.toLocaleString("tr-TR")} da`,
      icon: MapPin,
      description: "Toplam etkilenen alan",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      name: "Bekleyen İnceleme",
      value: pendingRecords.toString(),
      icon: FileCheck,
      description: "İnceleme bekleyen",
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
