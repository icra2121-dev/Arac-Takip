"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DamageRecord, DISASTER_LABELS, STATUS_LABELS, CROP_LABELS } from "@/lib/types";
import { formatCurrency, formatShortDate } from "@/lib/store";
import { cn } from "@/lib/utils";

interface RecentRecordsProps {
  records: DamageRecord[];
}

const statusColors: Record<DamageRecord["status"], string> = {
  beklemede: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  inceleniyor: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  onaylandi: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  reddedildi: "bg-destructive/10 text-destructive border-destructive/30",
};

export function RecentRecords({ records }: RecentRecordsProps) {
  const recentRecords = records.slice(0, 5);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Son Hasar Kayıtları
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/hasar-listesi" className="text-primary">
            Tümünü Gör
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {record.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusColors[record.status])}
                  >
                    {STATUS_LABELS[record.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{DISASTER_LABELS[record.disasterType]}</span>
                  <span>{CROP_LABELS[record.crop.type]}</span>
                  <span>{formatShortDate(record.disasterDate)}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(record.cost.totalDamage)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {record.damage.affectedArea} da
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
