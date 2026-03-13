"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DISASTER_LABELS, 
  CROP_LABELS, 
  STATUS_LABELS,
  DAMAGE_LEVEL_LABELS,
  DamageRecord,
} from "@/lib/types";
import { demoRecords, formatCurrency, formatDate, formatShortDate } from "@/lib/store";
import { 
  Search,
  Filter,
  Eye,
  FileDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Wheat,
  AlertTriangle,
  Calculator,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusColors: Record<DamageRecord["status"], string> = {
  beklemede: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  inceleniyor: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  onaylandi: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  reddedildi: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function HasarListesiPage() {
  const [records, setRecords] = useState<DamageRecord[]>(demoRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [disasterFilter, setDisasterFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<DamageRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<DamageRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<DamageRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.village.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesDisaster = disasterFilter === "all" || record.disasterType === disasterFilter;
    
    return matchesSearch && matchesStatus && matchesDisaster;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Kayıt düzenleme
  const handleEditRecord = (record: DamageRecord) => {
    setEditingRecord({ ...record });
    setSelectedRecord(null);
  };

  // Kayıt güncelleme
  const handleUpdateRecord = () => {
    if (!editingRecord) return;

    setRecords(prev => 
      prev.map(r => r.id === editingRecord.id ? { ...editingRecord, updatedAt: new Date().toISOString() } : r)
    );
    setEditingRecord(null);
  };

  // Kayıt silme
  const handleDeleteRecord = () => {
    if (!deletingRecord) return;

    setRecords(prev => prev.filter(r => r.id !== deletingRecord.id));
    setDeletingRecord(null);
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Afet Türü", "Tarih", "Köy", "Çiftçi", "Ürün", "Alan", "Hasar", "Durum"],
      ...filteredRecords.map(record => [
        record.id,
        DISASTER_LABELS[record.disasterType],
        formatShortDate(record.disasterDate),
        record.location.village,
        record.farmer.name,
        CROP_LABELS[record.crop.type],
        `${record.damage.affectedArea} da`,
        record.cost.totalDamage,
        STATUS_LABELS[record.status],
      ]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hasar_listesi_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hasar Kayıtları
            </h1>
            <p className="text-muted-foreground mt-1">
              Tüm hasar kayıtlarını görüntüleyin ve yönetin
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Dışa Aktar
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/hasar-kayit">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Kayıt
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ID, çiftçi adı veya köy ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={disasterFilter} onValueChange={setDisasterFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Afet Türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Afetler</SelectItem>
                    {Object.entries(DISASTER_LABELS).map(([key, label]) => (
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

        {/* Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Afet</TableHead>
                    <TableHead className="text-muted-foreground">Tarih</TableHead>
                    <TableHead className="text-muted-foreground">Konum</TableHead>
                    <TableHead className="text-muted-foreground">Çiftçi</TableHead>
                    <TableHead className="text-muted-foreground">Ürün</TableHead>
                    <TableHead className="text-muted-foreground text-right">Alan</TableHead>
                    <TableHead className="text-muted-foreground text-right">Hasar</TableHead>
                    <TableHead className="text-muted-foreground">Durum</TableHead>
                    <TableHead className="w-32 text-muted-foreground text-center">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                        Kayıt bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRecords.map((record) => (
                      <TableRow 
                        key={record.id} 
                        className="border-border/50 hover:bg-muted/30"
                      >
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{DISASTER_LABELS[record.disasterType]}</TableCell>
                        <TableCell>{formatShortDate(record.disasterDate)}</TableCell>
                        <TableCell>{record.location.village}</TableCell>
                        <TableCell>{record.farmer.name}</TableCell>
                        <TableCell>{CROP_LABELS[record.crop.type]}</TableCell>
                        <TableCell className="text-right">{record.damage.affectedArea} da</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(record.cost.totalDamage)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", statusColors[record.status])}
                          >
                            {STATUS_LABELS[record.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedRecord(record)}
                              title="Görüntüle"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditRecord(record)}
                              title="Düzenle"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeletingRecord(record)}
                              title="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  {filteredRecords.length} kayıttan {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredRecords.length)} arası gösteriliyor
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Sayfa {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Detail Dialog */}
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedRecord && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl">
                      Hasar Kaydı: {selectedRecord.id}
                    </DialogTitle>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", statusColors[selectedRecord.status])}
                    >
                      {STATUS_LABELS[selectedRecord.status]}
                    </Badge>
                  </div>
                  <DialogDescription>
                    {formatDate(selectedRecord.disasterDate)} tarihli {DISASTER_LABELS[selectedRecord.disasterType]} kaydı
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Afet Bilgileri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Afet Bilgileri
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Afet Türü</p>
                        <p className="font-medium">{DISASTER_LABELS[selectedRecord.disasterType]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Afet Tarihi</p>
                        <p className="font-medium">{formatDate(selectedRecord.disasterDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hasar Seviyesi</p>
                        <p className="font-medium">{DAMAGE_LEVEL_LABELS[selectedRecord.damage.level]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Kayıt Tarihi</p>
                        <p className="font-medium">{formatDate(selectedRecord.reportDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Konum Bilgileri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-chart-5" />
                      Konum Bilgileri
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Köy/Belde</p>
                        <p className="font-medium">{selectedRecord.location.village}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mahalle</p>
                        <p className="font-medium">{selectedRecord.location.neighborhood || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Parsel No</p>
                        <p className="font-medium">{selectedRecord.location.parcelNo || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Çiftçi Bilgileri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="h-4 w-4 text-chart-3" />
                      Çiftçi Bilgileri
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Ad Soyad</p>
                        <p className="font-medium">{selectedRecord.farmer.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">TC No</p>
                        <p className="font-medium">{selectedRecord.farmer.tcNo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Telefon</p>
                        <p className="font-medium">{selectedRecord.farmer.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Adres</p>
                        <p className="font-medium">{selectedRecord.farmer.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Wheat className="h-4 w-4 text-primary" />
                      Ürün ve Hasar Bilgileri
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Ürün Türü</p>
                        <p className="font-medium">{CROP_LABELS[selectedRecord.crop.type]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Toplam Alan</p>
                        <p className="font-medium">{selectedRecord.crop.area} dekar</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Etkilenen Alan</p>
                        <p className="font-medium">{selectedRecord.damage.affectedArea} dekar</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hasar Oranı</p>
                        <p className="font-medium">%{selectedRecord.damage.damagePercentage}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Hasar Açıklaması</p>
                      <p className="text-sm">{selectedRecord.damage.description}</p>
                    </div>
                  </div>

                  {/* Maliyet Bilgileri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calculator className="h-4 w-4 text-chart-4" />
                      Maliyet Bilgileri
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Tahmini Verim</p>
                        <p className="font-medium">{selectedRecord.cost.expectedYield} kg/da</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Piyasa Fiyatı</p>
                        <p className="font-medium">{selectedRecord.cost.marketPrice} TL/kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ürün Kaybı</p>
                        <p className="font-medium">{formatCurrency(selectedRecord.cost.totalLoss)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Girdi Maliyeti</p>
                        <p className="font-medium">{formatCurrency(selectedRecord.cost.inputCosts)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">İşçilik Maliyeti</p>
                        <p className="font-medium">{formatCurrency(selectedRecord.cost.laborCosts)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Toplam Hasar</p>
                        <p className="font-bold text-destructive">
                          {formatCurrency(selectedRecord.cost.totalDamage)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6 gap-2">
                  <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                    Kapat
                  </Button>
                  <Button onClick={() => handleEditRecord(selectedRecord)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Düzenle
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {editingRecord && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Kaydı Düzenle: {editingRecord.id}
                  </DialogTitle>
                  <DialogDescription>
                    Hasar kaydı bilgilerini güncelleyin
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Durum */}
                  <div className="space-y-2">
                    <Label>Kayıt Durumu</Label>
                    <Select
                      value={editingRecord.status}
                      onValueChange={(value: DamageRecord["status"]) => 
                        setEditingRecord(prev => prev ? { ...prev, status: value } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Çiftçi Bilgileri */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Çiftçi Bilgileri</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Ad Soyad</Label>
                        <Input
                          value={editingRecord.farmer.name}
                          onChange={(e) => setEditingRecord(prev => prev ? {
                            ...prev,
                            farmer: { ...prev.farmer, name: e.target.value }
                          } : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Telefon</Label>
                        <Input
                          value={editingRecord.farmer.phone}
                          onChange={(e) => setEditingRecord(prev => prev ? {
                            ...prev,
                            farmer: { ...prev.farmer, phone: e.target.value }
                          } : null)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hasar Bilgileri */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Hasar Bilgileri</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Etkilenen Alan (da)</Label>
                        <Input
                          type="number"
                          value={editingRecord.damage.affectedArea}
                          onChange={(e) => setEditingRecord(prev => prev ? {
                            ...prev,
                            damage: { ...prev.damage, affectedArea: parseFloat(e.target.value) || 0 }
                          } : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Hasar Seviyesi</Label>
                        <Select
                          value={editingRecord.damage.level}
                          onValueChange={(value: DamageRecord["damage"]["level"]) => 
                            setEditingRecord(prev => prev ? {
                              ...prev,
                              damage: { ...prev.damage, level: value }
                            } : null)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Hasar Açıklaması</Label>
                      <Textarea
                        value={editingRecord.damage.description}
                        onChange={(e) => setEditingRecord(prev => prev ? {
                          ...prev,
                          damage: { ...prev.damage, description: e.target.value }
                        } : null)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Maliyet Bilgileri */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Maliyet Bilgileri</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Ürün Kaybı (TL)</Label>
                        <Input
                          type="number"
                          value={editingRecord.cost.totalLoss}
                          onChange={(e) => {
                            const totalLoss = parseFloat(e.target.value) || 0;
                            setEditingRecord(prev => prev ? {
                              ...prev,
                              cost: { 
                                ...prev.cost, 
                                totalLoss,
                                totalDamage: totalLoss + prev.cost.inputCosts + prev.cost.laborCosts
                              }
                            } : null);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Girdi Maliyeti (TL)</Label>
                        <Input
                          type="number"
                          value={editingRecord.cost.inputCosts}
                          onChange={(e) => {
                            const inputCosts = parseFloat(e.target.value) || 0;
                            setEditingRecord(prev => prev ? {
                              ...prev,
                              cost: { 
                                ...prev.cost, 
                                inputCosts,
                                totalDamage: prev.cost.totalLoss + inputCosts + prev.cost.laborCosts
                              }
                            } : null);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">İşçilik (TL)</Label>
                        <Input
                          type="number"
                          value={editingRecord.cost.laborCosts}
                          onChange={(e) => {
                            const laborCosts = parseFloat(e.target.value) || 0;
                            setEditingRecord(prev => prev ? {
                              ...prev,
                              cost: { 
                                ...prev.cost, 
                                laborCosts,
                                totalDamage: prev.cost.totalLoss + prev.cost.inputCosts + laborCosts
                              }
                            } : null);
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Toplam Hasar</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(editingRecord.cost.totalDamage)}
                      </p>
                    </div>
                  </div>

                  {/* Notlar */}
                  <div className="space-y-2">
                    <Label>Notlar</Label>
                    <Textarea
                      value={editingRecord.notes || ""}
                      onChange={(e) => setEditingRecord(prev => prev ? {
                        ...prev,
                        notes: e.target.value
                      } : null)}
                      placeholder="Ek notlar..."
                      rows={2}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6 gap-2">
                  <Button variant="outline" onClick={() => setEditingRecord(null)}>
                    <X className="mr-2 h-4 w-4" />
                    İptal
                  </Button>
                  <Button onClick={handleUpdateRecord} className="bg-primary hover:bg-primary/90">
                    <Save className="mr-2 h-4 w-4" />
                    Kaydet
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingRecord} onOpenChange={() => setDeletingRecord(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kaydı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{deletingRecord?.id}</strong> numaralı kayıt kalıcı olarak silinecektir.
                Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRecord}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
