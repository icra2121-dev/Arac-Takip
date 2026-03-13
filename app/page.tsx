"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DisasterTypeChart } from "@/components/dashboard/disaster-type-chart";
import { DamageCostChart } from "@/components/dashboard/damage-cost-chart";
import { RecentRecords } from "@/components/dashboard/recent-records";
import { demoRecords, getStatistics } from "@/lib/store";

export default function DashboardPage() {
  const stats = getStatistics(demoRecords);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Tarımsal Afet Hasar Takip Sistemi
          </h1>
          <p className="text-muted-foreground mt-1">
            Doğal afetlerin tarımsal alanlara verdiği zararın tespiti ve analizi
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalRecords={stats.totalRecords}
          totalDamage={stats.totalDamage}
          totalAffectedArea={stats.totalAffectedArea}
          pendingRecords={stats.byStatus.beklemede || 0}
        />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DisasterTypeChart data={stats.byDisasterType} />
          <DamageCostChart data={stats.damageByDisasterType} />
        </div>

        {/* Recent Records */}
        <RecentRecords records={demoRecords} />
      </div>
    </DashboardLayout>
  );
}
