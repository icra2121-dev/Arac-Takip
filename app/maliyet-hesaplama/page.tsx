"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CROP_LABELS, 
  DAMAGE_LEVEL_LABELS,
  CropType,
  DamageLevel,
  AVERAGE_YIELDS,
  MARKET_PRICES,
} from "@/lib/types";
import { formatCurrency } from "@/lib/store";
import { 
  Calculator,
  Plus,
  Trash2,
  FileDown,
  RotateCcw,
  TrendingDown,
  Wheat,
  Banknote,
} from "lucide-react";

interface CostItem {
  id: string;
  cropType: CropType;
  area: number;
  damageLevel: DamageLevel;
  expectedYield: number;
  marketPrice: number;
  inputCosts: number;
  laborCosts: number;
  productionLoss: number;
  totalDamage: number;
}

const getDamageMultiplier = (level: DamageLevel): number => {
  switch (level) {
    case "hafif": return 0.25;
    case "orta": return 0.50;
    case "agir": return 0.75;
    case "tam_kayip": return 1.0;
    default: return 0;
  }
};

export default function MaliyetHesaplamaPage() {
  const [items, setItems] = useState<CostItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    cropType: "" as CropType | "",
    area: "",
    damageLevel: "" as DamageLevel | "",
    expectedYield: "",
    marketPrice: "",
    inputCosts: "",
    laborCosts: "",
  });

  const [totals, setTotals] = useState({
    totalArea: 0,
    totalProductionLoss: 0,
    totalInputCosts: 0,
    totalLaborCosts: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    const totalArea = items.reduce((sum, item) => sum + item.area, 0);
    const totalProductionLoss = items.reduce((sum, item) => sum + item.productionLoss, 0);
    const totalInputCosts = items.reduce((sum, item) => sum + item.inputCosts, 0);
    const totalLaborCosts = items.reduce((sum, item) => sum + item.laborCosts, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.totalDamage, 0);
    
    setTotals({
      totalArea,
      totalProductionLoss,
      totalInputCosts,
      totalLaborCosts,
      grandTotal,
    });
  }, [items]);

  const handleCropChange = (value: string) => {
    const cropType = value as CropType;
    setCurrentItem(prev => ({
      ...prev,
      cropType,
      expectedYield: AVERAGE_YIELDS[cropType].toString(),
      marketPrice: MARKET_PRICES[cropType].toString(),
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.cropType || !currentItem.area || !currentItem.damageLevel) {
      alert("Lütfen ürün türü, alan ve hasar seviyesi alanlarını doldurun.");
      return;
    }

    const area = parseFloat(currentItem.area) || 0;
    const expectedYield = parseFloat(currentItem.expectedYield) || 0;
    const marketPrice = parseFloat(currentItem.marketPrice) || 0;
    const inputCosts = parseFloat(currentItem.inputCosts) || 0;
    const laborCosts = parseFloat(currentItem.laborCosts) || 0;
    const damageMultiplier = getDamageMultiplier(currentItem.damageLevel as DamageLevel);
    
    const productionLoss = area * expectedYield * marketPrice * damageMultiplier;
    const totalDamage = productionLoss + inputCosts + laborCosts;

    const newItem: CostItem = {
      id: Date.now().toString(),
      cropType: currentItem.cropType as CropType,
      area,
      damageLevel: currentItem.damageLevel as DamageLevel,
      expectedYield,
      marketPrice,
      inputCosts,
      laborCosts,
      productionLoss,
      totalDamage,
    };

    setItems(prev => [...prev, newItem]);
    setCurrentItem({
      cropType: "",
      area: "",
      damageLevel: "",
      expectedYield: "",
      marketPrice: "",
      inputCosts: "",
      laborCosts: "",
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleExport = () => {
    const csv = [
      ["Ürün", "Alan (da)", "Hasar Seviyesi", "Verim (kg/da)", "Fiyat (TL/kg)", "Girdi Maliyeti", "İşçilik", "Üretim Kaybı", "Toplam Hasar"],
      ...items.map(item => [
        CROP_LABELS[item.cropType],
        item.area,
        DAMAGE_LEVEL_LABELS[item.damageLevel],
        item.expectedYield,
        item.marketPrice,
        item.inputCosts,
        item.laborCosts,
        item.productionLoss,
        item.totalDamage,
      ]),
      [],
      ["TOPLAM", totals.totalArea, "", "", "", totals.totalInputCosts, totals.totalLaborCosts, totals.totalProductionLoss, totals.grandTotal],
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `maliyet_raporu_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Maliyet Hesaplama
          </h1>
          <p className="text-muted-foreground mt-1">
            Tarımsal hasar maliyet analizi ve hesaplama aracı
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wheat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Toplam Alan</p>
                  <p className="text-lg font-bold text-foreground">
                    {totals.totalArea.toLocaleString("tr-TR")} da
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Banknote className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Girdi Maliyeti</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(totals.totalInputCosts)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-5/10">
                  <TrendingDown className="h-5 w-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Üretim Kaybı</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(totals.totalProductionLoss)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Calculator className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Toplam Hasar</p>
                  <p className="text-xl font-bold text-destructive">
                    {formatCurrency(totals.grandTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Item Form */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Yeni Kalem Ekle</CardTitle>
            <CardDescription>Hasar görmüş ürün kalemini ekleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-7">
              <div className="space-y-2">
                <Label>Ürün Türü</Label>
                <Select
                  value={currentItem.cropType}
                  onValueChange={handleCropChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CROP_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Alan (da)</Label>
                <Input
                  type="number"
                  value={currentItem.area}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label>Hasar Seviyesi</Label>
                <Select
                  value={currentItem.damageLevel}
                  onValueChange={(value) => setCurrentItem(prev => ({ ...prev, damageLevel: value as DamageLevel }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DAMAGE_LEVEL_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Verim (kg/da)</Label>
                <Input
                  type="number"
                  value={currentItem.expectedYield}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, expectedYield: e.target.value }))}
                  placeholder="350"
                />
              </div>
              <div className="space-y-2">
                <Label>Fiyat (TL/kg)</Label>
                <Input
                  type="number"
                  value={currentItem.marketPrice}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, marketPrice: e.target.value }))}
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label>Girdi (TL)</Label>
                <Input
                  type="number"
                  value={currentItem.inputCosts}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, inputCosts: e.target.value }))}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label>İşçilik (TL)</Label>
                <Input
                  type="number"
                  value={currentItem.laborCosts}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, laborCosts: e.target.value }))}
                  placeholder="2000"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Kalem Ekle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Maliyet Kalemleri</CardTitle>
              <CardDescription>Eklenen tüm hasar kalemleri</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClearAll} disabled={items.length === 0}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Temizle
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={items.length === 0}>
                <FileDown className="mr-2 h-4 w-4" />
                CSV İndir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Henüz kalem eklenmedi</p>
                <p className="text-sm">Yukarıdaki formu kullanarak maliyet kalemi ekleyin</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-muted-foreground">Ürün</TableHead>
                      <TableHead className="text-muted-foreground text-right">Alan</TableHead>
                      <TableHead className="text-muted-foreground">Hasar</TableHead>
                      <TableHead className="text-muted-foreground text-right">Verim</TableHead>
                      <TableHead className="text-muted-foreground text-right">Fiyat</TableHead>
                      <TableHead className="text-muted-foreground text-right">Girdi</TableHead>
                      <TableHead className="text-muted-foreground text-right">İşçilik</TableHead>
                      <TableHead className="text-muted-foreground text-right">Üretim Kaybı</TableHead>
                      <TableHead className="text-muted-foreground text-right">Toplam</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{CROP_LABELS[item.cropType]}</TableCell>
                        <TableCell className="text-right">{item.area} da</TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            {DAMAGE_LEVEL_LABELS[item.damageLevel]}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.expectedYield}</TableCell>
                        <TableCell className="text-right">{item.marketPrice}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.inputCosts)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.laborCosts)}</TableCell>
                        <TableCell className="text-right text-chart-5">{formatCurrency(item.productionLoss)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.totalDamage)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Total Row */}
                    <TableRow className="border-t-2 border-border bg-muted/30 font-semibold">
                      <TableCell>TOPLAM</TableCell>
                      <TableCell className="text-right">{totals.totalArea} da</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.totalInputCosts)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.totalLaborCosts)}</TableCell>
                      <TableCell className="text-right text-chart-5">{formatCurrency(totals.totalProductionLoss)}</TableCell>
                      <TableCell className="text-right text-destructive text-lg">{formatCurrency(totals.grandTotal)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
