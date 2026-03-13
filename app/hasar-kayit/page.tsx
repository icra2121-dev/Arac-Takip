"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DISASTER_LABELS, 
  CROP_LABELS, 
  DAMAGE_LEVEL_LABELS,
  DisasterType,
  CropType,
  DamageLevel,
  AVERAGE_YIELDS,
  MARKET_PRICES,
  GreenhouseDamageItem,
} from "@/lib/types";
import { PROVINCES, getDistrictsByProvinceId, getNeighborhoodsByDistrictId, District } from "@/lib/turkey-locations";
import { GREENHOUSE_MATERIALS, GREENHOUSE_CATEGORY_LABELS, ANTALYA_HAL_PRICES } from "@/lib/prices";
import { formatCurrency } from "@/lib/store";
import { 
  AlertTriangle, 
  User, 
  MapPin, 
  Wheat, 
  Calculator,
  Save,
  RotateCcw,
  Home,
  Plus,
  Trash2,
  Info
} from "lucide-react";

export default function HasarKayitPage() {
  // Konum state'leri
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);

  // Sera state'leri
  const [hasGreenhouse, setHasGreenhouse] = useState(false);
  const [greenhouseItems, setGreenhouseItems] = useState<GreenhouseDamageItem[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState("");
  const [materialDamagePercent, setMaterialDamagePercent] = useState("");

  const [formData, setFormData] = useState({
    // Afet Bilgileri
    disasterType: "" as DisasterType | "",
    disasterDate: "",
    
    // Konum Bilgileri
    provinceName: "",
    districtName: "",
    neighborhood: "",
    village: "",
    parcelNo: "",
    
    // Çiftçi Bilgileri
    farmerName: "",
    tcNo: "",
    phone: "",
    address: "",
    
    // Ürün Bilgileri
    cropType: "" as CropType | "",
    customCropType: "",
    area: "",
    plantingDate: "",
    expectedHarvestDate: "",
    
    // Hasar Bilgileri
    damageLevel: "" as DamageLevel | "",
    affectedArea: "",
    description: "",
    
    // Maliyet Bilgileri
    expectedYield: "",
    marketPrice: "",
    inputCosts: "",
    laborCosts: "",

    // Sera Bilgileri
    greenhouseArea: "",
  });

  const [calculatedCosts, setCalculatedCosts] = useState({
    totalLoss: 0,
    greenhouseDamage: 0,
    totalDamage: 0,
  });

  // İl değiştiğinde ilçeleri güncelle
  useEffect(() => {
    if (selectedProvinceId) {
      const provinceDistricts = getDistrictsByProvinceId(selectedProvinceId);
      setDistricts(provinceDistricts);
      setSelectedDistrictId(null);
      setNeighborhoods([]);
      
      const province = PROVINCES.find(p => p.id === selectedProvinceId);
      setFormData(prev => ({ ...prev, provinceName: province?.name || "", districtName: "", neighborhood: "" }));
    }
  }, [selectedProvinceId]);

  // İlçe değiştiğinde mahalleleri güncelle
  useEffect(() => {
    if (selectedDistrictId) {
      const districtNeighborhoods = getNeighborhoodsByDistrictId(selectedDistrictId);
      setNeighborhoods(districtNeighborhoods);
      
      const district = districts.find(d => d.id === selectedDistrictId);
      setFormData(prev => ({ ...prev, districtName: district?.name || "", neighborhood: "" }));
    }
  }, [selectedDistrictId, districts]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Ürün seçildiğinde verim ve fiyat değerlerini otomatik doldur
    if (field === "cropType" && value in AVERAGE_YIELDS) {
      const cropKey = value as CropType;
      
      // Hal fiyatlarından güncel fiyat bul
      let marketPrice = MARKET_PRICES[cropKey];
      const halPrice = ANTALYA_HAL_PRICES.find(p => {
        const cropName = CROP_LABELS[cropKey].toLowerCase();
        return p.name.toLowerCase().includes(cropName) || cropName.includes(p.name.toLowerCase());
      });
      if (halPrice) {
        marketPrice = halPrice.avgPrice;
      }

      setFormData(prev => ({
        ...prev,
        cropType: cropKey,
        expectedYield: AVERAGE_YIELDS[cropKey].toString(),
        marketPrice: marketPrice.toString(),
      }));
    }
  };

  // Sera malzemesi ekle
  const handleAddGreenhouseItem = () => {
    if (!selectedMaterialId || !materialQuantity || !materialDamagePercent) return;

    const material = GREENHOUSE_MATERIALS.find(m => m.id === selectedMaterialId);
    if (!material) return;

    const quantity = parseFloat(materialQuantity);
    const damagePercent = parseFloat(materialDamagePercent);
    const totalDamage = material.unitPrice * quantity * (damagePercent / 100);

    const newItem: GreenhouseDamageItem = {
      materialId: material.id,
      materialName: material.name,
      quantity,
      unit: material.unit,
      unitPrice: material.unitPrice,
      damagePercentage: damagePercent,
      totalDamage,
    };

    setGreenhouseItems(prev => [...prev, newItem]);
    setSelectedMaterialId("");
    setMaterialQuantity("");
    setMaterialDamagePercent("");
  };

  // Sera malzemesi sil
  const handleRemoveGreenhouseItem = (index: number) => {
    setGreenhouseItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateCosts = () => {
    const affectedArea = parseFloat(formData.affectedArea) || 0;
    const expectedYield = parseFloat(formData.expectedYield) || 0;
    const marketPrice = parseFloat(formData.marketPrice) || 0;
    const inputCosts = parseFloat(formData.inputCosts) || 0;
    const laborCosts = parseFloat(formData.laborCosts) || 0;
    
    let damageMultiplier = 0;
    switch (formData.damageLevel) {
      case "hafif": damageMultiplier = 0.25; break;
      case "orta": damageMultiplier = 0.50; break;
      case "agir": damageMultiplier = 0.75; break;
      case "tam_kayip": damageMultiplier = 1.0; break;
    }
    
    const totalLoss = affectedArea * expectedYield * marketPrice * damageMultiplier;
    const greenhouseDamage = greenhouseItems.reduce((sum, item) => sum + item.totalDamage, 0);
    const totalDamage = totalLoss + inputCosts + laborCosts + greenhouseDamage;
    
    setCalculatedCosts({ totalLoss, greenhouseDamage, totalDamage });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateCosts();
    alert("Hasar kaydı başarıyla oluşturuldu!");
  };

  const handleReset = () => {
    setFormData({
      disasterType: "",
      disasterDate: "",
      provinceName: "",
      districtName: "",
      neighborhood: "",
      village: "",
      parcelNo: "",
      farmerName: "",
      tcNo: "",
      phone: "",
      address: "",
      cropType: "",
      customCropType: "",
      area: "",
      plantingDate: "",
      expectedHarvestDate: "",
      damageLevel: "",
      affectedArea: "",
      description: "",
      expectedYield: "",
      marketPrice: "",
      inputCosts: "",
      laborCosts: "",
      greenhouseArea: "",
    });
    setSelectedProvinceId(null);
    setSelectedDistrictId(null);
    setDistricts([]);
    setNeighborhoods([]);
    setHasGreenhouse(false);
    setGreenhouseItems([]);
    setCalculatedCosts({ totalLoss: 0, greenhouseDamage: 0, totalDamage: 0 });
  };

  // Sera malzemelerini kategoriye göre grupla
  const groupedMaterials = GREENHOUSE_MATERIALS.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, typeof GREENHOUSE_MATERIALS>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Yeni Hasar Kaydı Oluştur
          </h1>
          <p className="text-muted-foreground mt-1">
            Doğal afet sonrası tarımsal hasar bilgilerini girin
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Afet Bilgileri */}
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Afet Bilgileri</CardTitle>
                    <CardDescription>Afet türü ve tarih bilgileri</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="disasterType">Afet Türü *</Label>
                  <Select
                    value={formData.disasterType}
                    onValueChange={(value) => handleInputChange("disasterType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Afet türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISASTER_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disasterDate">Afet Tarihi *</Label>
                  <Input
                    id="disasterDate"
                    type="date"
                    value={formData.disasterDate}
                    onChange={(e) => handleInputChange("disasterDate", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Konum Bilgileri */}
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-chart-5/10">
                    <MapPin className="h-5 w-5 text-chart-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Konum Bilgileri</CardTitle>
                    <CardDescription>Tarlanın konum detayları</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">İl *</Label>
                    <Select
                      value={selectedProvinceId?.toString() || ""}
                      onValueChange={(value) => setSelectedProvinceId(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="İl seçin" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {PROVINCES.map((province) => (
                          <SelectItem key={province.id} value={province.id.toString()}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">İlçe *</Label>
                    <Select
                      value={selectedDistrictId?.toString() || ""}
                      onValueChange={(value) => setSelectedDistrictId(parseInt(value))}
                      disabled={!selectedProvinceId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="İlçe seçin" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id.toString()}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Mahalle *</Label>
                    <Select
                      value={formData.neighborhood}
                      onValueChange={(value) => handleInputChange("neighborhood", value)}
                      disabled={!selectedDistrictId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Mahalle seçin" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {neighborhoods.map((neighborhood) => (
                          <SelectItem key={neighborhood} value={neighborhood}>
                            {neighborhood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Köy/Belde</Label>
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) => handleInputChange("village", e.target.value)}
                      placeholder="Köy/Belde adı"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcelNo">Parsel No</Label>
                  <Input
                    id="parcelNo"
                    value={formData.parcelNo}
                    onChange={(e) => handleInputChange("parcelNo", e.target.value)}
                    placeholder="Örn: 123-45"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Çiftçi Bilgileri */}
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-chart-3/10">
                    <User className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Çiftçi Bilgileri</CardTitle>
                    <CardDescription>Çiftçi kişisel bilgileri</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmerName">Ad Soyad *</Label>
                  <Input
                    id="farmerName"
                    value={formData.farmerName}
                    onChange={(e) => handleInputChange("farmerName", e.target.value)}
                    placeholder="Çiftçi adı soyadı"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tcNo">TC Kimlik No *</Label>
                    <Input
                      id="tcNo"
                      value={formData.tcNo}
                      onChange={(e) => handleInputChange("tcNo", e.target.value)}
                      placeholder="11 haneli TC No"
                      maxLength={11}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="05XX XXX XXXX"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Tam adres"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ürün Bilgileri */}
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wheat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Ürün Bilgileri</CardTitle>
                    <CardDescription>Yetiştirilen ürün detayları</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cropType">Ürün Türü *</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(value) => handleInputChange("cropType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ürün seçin" />
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
                {formData.cropType === "diger" && (
                  <div className="space-y-2">
                    <Label htmlFor="customCropType">Diğer Ürün Adı</Label>
                    <Input
                      id="customCropType"
                      value={formData.customCropType}
                      onChange={(e) => handleInputChange("customCropType", e.target.value)}
                      placeholder="Ürün adını girin"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="area">Toplam Ekili Alan (Dekar) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="Örn: 50"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plantingDate">Ekim Tarihi</Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      value={formData.plantingDate}
                      onChange={(e) => handleInputChange("plantingDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedHarvestDate">Tahmini Hasat</Label>
                    <Input
                      id="expectedHarvestDate"
                      type="date"
                      value={formData.expectedHarvestDate}
                      onChange={(e) => handleInputChange("expectedHarvestDate", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hasar Bilgileri */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <AlertTriangle className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Hasar Detayları</CardTitle>
                    <CardDescription>Oluşan hasarın detaylı bilgileri</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="damageLevel">Hasar Seviyesi *</Label>
                    <Select
                      value={formData.damageLevel}
                      onValueChange={(value) => handleInputChange("damageLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hasar seviyesi seçin" />
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
                    <Label htmlFor="affectedArea">Etkilenen Alan (Dekar) *</Label>
                    <Input
                      id="affectedArea"
                      type="number"
                      value={formData.affectedArea}
                      onChange={(e) => handleInputChange("affectedArea", e.target.value)}
                      placeholder="Örn: 35"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hasar Oranı</Label>
                    <div className="h-10 flex items-center px-3 rounded-md bg-muted text-muted-foreground">
                      {formData.damageLevel ? DAMAGE_LEVEL_LABELS[formData.damageLevel as DamageLevel] : "Seçilmedi"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Hasar Açıklaması *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Hasarın detaylı açıklamasını yazın..."
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sera Hasar Bilgileri */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-chart-3/10">
                      <Home className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Sera / Yapı Hasarı</CardTitle>
                      <CardDescription>Sera örtü ve yapı malzemeleri hasarı</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hasGreenhouse"
                      checked={hasGreenhouse}
                      onCheckedChange={(checked) => setHasGreenhouse(checked as boolean)}
                    />
                    <Label htmlFor="hasGreenhouse" className="text-sm cursor-pointer">
                      Sera/Yapı hasarı var
                    </Label>
                  </div>
                </div>
              </CardHeader>
              {hasGreenhouse && (
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Fiyatlar Çevre, Şehircilik ve İklim Değişikliği Bakanlığı 2026 yılı birim fiyatları ve güncel piyasa rayicinden alınmıştır.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Sera Toplam Alanı (m²)</Label>
                    <Input
                      type="number"
                      value={formData.greenhouseArea}
                      onChange={(e) => handleInputChange("greenhouseArea", e.target.value)}
                      placeholder="Örn: 1000"
                    />
                  </div>

                  {/* Malzeme Ekleme */}
                  <div className="border border-border/50 rounded-lg p-4 space-y-4">
                    <Label className="text-sm font-medium">Hasar Kalemi Ekle</Label>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Malzeme</Label>
                        <Select
                          value={selectedMaterialId}
                          onValueChange={setSelectedMaterialId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Malzeme seçin" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {Object.entries(groupedMaterials).map(([category, materials]) => (
                              <div key={category}>
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                                  {GREENHOUSE_CATEGORY_LABELS[category as keyof typeof GREENHOUSE_CATEGORY_LABELS]}
                                </div>
                                {materials.map((material) => (
                                  <SelectItem key={material.id} value={material.id}>
                                    {material.name} - {formatCurrency(material.unitPrice)}/{material.unit}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Miktar</Label>
                        <Input
                          type="number"
                          value={materialQuantity}
                          onChange={(e) => setMaterialQuantity(e.target.value)}
                          placeholder="Miktar"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Hasar %</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={materialDamagePercent}
                            onChange={(e) => setMaterialDamagePercent(e.target.value)}
                            placeholder="%"
                          />
                          <Button
                            type="button"
                            onClick={handleAddGreenhouseItem}
                            disabled={!selectedMaterialId || !materialQuantity || !materialDamagePercent}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eklenen Malzemeler Listesi */}
                  {greenhouseItems.length > 0 && (
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Malzeme</th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Miktar</th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Birim Fiyat</th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Hasar %</th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Hasar Tutarı</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {greenhouseItems.map((item, index) => (
                            <tr key={index} className="border-t border-border/50">
                              <td className="px-4 py-2 text-sm">{item.materialName}</td>
                              <td className="px-4 py-2 text-sm text-right">{item.quantity} {item.unit}</td>
                              <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-2 text-sm text-right">%{item.damagePercentage}</td>
                              <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.totalDamage)}</td>
                              <td className="px-2 py-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleRemoveGreenhouseItem(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t border-border bg-muted/30">
                            <td colSpan={4} className="px-4 py-2 text-sm font-medium text-right">
                              Toplam Sera/Yapı Hasarı:
                            </td>
                            <td className="px-4 py-2 text-sm font-bold text-right text-primary">
                              {formatCurrency(greenhouseItems.reduce((sum, item) => sum + item.totalDamage, 0))}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Maliyet Hesaplama */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-chart-4/10">
                      <Calculator className="h-5 w-5 text-chart-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Maliyet Bilgileri</CardTitle>
                      <CardDescription>Tahmini verim ve maliyet değerleri</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Kaynak: Antalya Hal Fiyatları
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedYield">Tahmini Verim (kg/da)</Label>
                    <Input
                      id="expectedYield"
                      type="number"
                      value={formData.expectedYield}
                      onChange={(e) => handleInputChange("expectedYield", e.target.value)}
                      placeholder="Örn: 350"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marketPrice">Piyasa Fiyatı (TL/kg)</Label>
                    <Input
                      id="marketPrice"
                      type="number"
                      value={formData.marketPrice}
                      onChange={(e) => handleInputChange("marketPrice", e.target.value)}
                      placeholder="Örn: 12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inputCosts">Girdi Maliyeti (TL)</Label>
                    <Input
                      id="inputCosts"
                      type="number"
                      value={formData.inputCosts}
                      onChange={(e) => handleInputChange("inputCosts", e.target.value)}
                      placeholder="Tohum, gübre, ilaç vb."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="laborCosts">İşçilik Maliyeti (TL)</Label>
                    <Input
                      id="laborCosts"
                      type="number"
                      value={formData.laborCosts}
                      onChange={(e) => handleInputChange("laborCosts", e.target.value)}
                      placeholder="İşçilik giderleri"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={calculateCosts}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Hesapla
                  </Button>
                  
                  {calculatedCosts.totalDamage > 0 && (
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Ürün Kaybı</p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(calculatedCosts.totalLoss)}
                        </p>
                      </div>
                      {hasGreenhouse && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Sera/Yapı Hasarı</p>
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(calculatedCosts.greenhouseDamage)}
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-xs text-muted-foreground">Toplam Hasar</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(calculatedCosts.totalDamage)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Temizle
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
