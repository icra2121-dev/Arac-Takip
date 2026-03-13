"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { 
  DISASTER_LABELS, 
  CROP_LABELS, 
  STATUS_LABELS,
  DisasterType,
  CropType,
} from "@/lib/types";
import { demoRecords, getStatistics, formatCurrency } from "@/lib/store";
import { 
  FileDown,
  Calendar,
  Filter,
  BarChart3,
  PieChartIcon,
  TrendingUp,
  FileText,
} from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
];

export default function RaporlarPage() {
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });
  const [selectedDisaster, setSelectedDisaster] = useState<string>("all");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  const stats = getStatistics(demoRecords);

  // Monthly damage data
  const monthlyData = [
    { month: "Oca", damage: 0, count: 0 },
    { month: "Şub", damage: 0, count: 0 },
    { month: "Mar", damage: 0, count: 0 },
    { month: "Nis", damage: 1059500, count: 1 },
    { month: "May", damage: 111000, count: 1 },
    { month: "Haz", damage: 165300, count: 1 },
    { month: "Tem", damage: 852000, count: 1 },
    { month: "Ağu", damage: 172500, count: 1 },
    { month: "Eyl", damage: 0, count: 0 },
    { month: "Eki", damage: 0, count: 0 },
    { month: "Kas", damage: 0, count: 0 },
    { month: "Ara", damage: 0, count: 0 },
  ];

  // Disaster type data
  const disasterData = Object.entries(stats.damageByDisasterType).map(([key, value]) => ({
    name: DISASTER_LABELS[key as DisasterType],
    value,
    count: stats.byDisasterType[key as DisasterType] || 0,
  }));

  // Crop type data
  const cropData = demoRecords.reduce((acc, record) => {
    const existing = acc.find(item => item.cropType === record.crop.type);
    if (existing) {
      existing.damage += record.cost.totalDamage;
      existing.area += record.damage.affectedArea;
      existing.count += 1;
    } else {
      acc.push({
        cropType: record.crop.type,
        name: CROP_LABELS[record.crop.type],
        damage: record.cost.totalDamage,
        area: record.damage.affectedArea,
        count: 1,
      });
    }
    return acc;
  }, [] as { cropType: CropType; name: string; damage: number; area: number; count: number }[]);

  // Status distribution
  const statusData = Object.entries(stats.byStatus).map(([key, value]) => ({
    name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
    value,
  }));

  const handleExportPDF = () => {
    alert("PDF raporu oluşturuluyor...");
  };

  const handleExportExcel = () => {
    const csv = [
      ["Tarımsal Afet Hasar Raporu"],
      ["Rapor Tarihi:", new Date().toLocaleDateString("tr-TR")],
      [],
      ["ÖZET BİLGİLER"],
      ["Toplam Kayıt:", stats.totalRecords],
      ["Toplam Hasar:", formatCurrency(stats.totalDamage)],
      ["Etkilenen Alan:", `${stats.totalAffectedArea} dekar`],
      ["Ortalama Hasar:", formatCurrency(stats.averageDamage)],
      [],
      ["AFET TÜRÜNE GÖRE DAĞILIM"],
      ["Afet Türü", "Kayıt Sayısı", "Toplam Hasar"],
      ...disasterData.map(item => [item.name, item.count, formatCurrency(item.value)]),
      [],
      ["ÜRÜN TÜRÜNE GÖRE DAĞILIM"],
      ["Ürün", "Kayıt Sayısı", "Etkilenen Alan", "Toplam Hasar"],
      ...cropData.map(item => [item.name, item.count, `${item.area} da`, formatCurrency(item.damage)]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tarimsal_afet_raporu_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Raporlar ve Analizler
            </h1>
            <p className="text-muted-foreground mt-1">
              Detaylı hasar istatistikleri ve analiz raporları
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <FileDown className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Filtreler</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Başlangıç Tarihi</Label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Bitiş Tarihi</Label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Afet Türü</Label>
                <Select value={selectedDisaster} onValueChange={setSelectedDisaster}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {Object.entries(DISASTER_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ürün Türü</Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {Object.entries(CROP_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Toplam Kayıt</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalRecords}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Toplam Hasar</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(stats.totalDamage)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Etkilenen Alan</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalAffectedArea.toLocaleString("tr-TR")} da</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Ortalama Hasar</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.averageDamage)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="monthly" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Aylık</span>
            </TabsTrigger>
            <TabsTrigger value="disaster" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Afet</span>
            </TabsTrigger>
            <TabsTrigger value="crop" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Ürün</span>
            </TabsTrigger>
            <TabsTrigger value="trend" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trend</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Aylık Hasar Dağılımı</CardTitle>
                <CardDescription>2024 yılı aylık hasar miktarları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
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
                      />
                      <Bar dataKey="damage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disaster">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Afet Türüne Göre Hasar</CardTitle>
                  <CardDescription>Toplam hasar miktarı dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={disasterData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          type="number"
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={80}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), "Hasar"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Afet Türüne Göre Kayıt Sayısı</CardTitle>
                  <CardDescription>Olay sayısı dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={disasterData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {disasterData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crop">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Ürün Türüne Göre Hasar</CardTitle>
                  <CardDescription>Ürün bazında hasar dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cropData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), "Hasar"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="damage" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Etkilenen Alan Dağılımı</CardTitle>
                  <CardDescription>Ürün bazında etkilenen alan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cropData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="area"
                          label={({ name, value }) => `${name}: ${value} da`}
                          labelLine={false}
                        >
                          {cropData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value} da`, "Alan"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trend">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Kümülatif Hasar Trendi</CardTitle>
                <CardDescription>Yıl içi toplam hasar birikimi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData.map((item, index) => ({
                        ...item,
                        cumulative: monthlyData
                          .slice(0, index + 1)
                          .reduce((sum, m) => sum + m.damage, 0),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Kümülatif Hasar"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Durum Dağılımı</CardTitle>
            <CardDescription>Kayıtların işlem durumlarına göre dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {statusData.map((item, index) => (
                <div
                  key={item.name}
                  className="p-4 rounded-lg bg-muted/30 text-center"
                >
                  <p className="text-3xl font-bold" style={{ color: COLORS[index] }}>
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
