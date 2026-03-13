export type DisasterType = 
  | "sel_baskini"
  | "su_basma"
  | "dolu"
  | "yangin"
  | "hortum"
  | "firtina";

export type CropType =
  | "bugday"
  | "arpa"
  | "misir"
  | "aycicegi"
  | "pamuk"
  | "seker_pancari"
  | "domates"
  | "biber"
  | "patates"
  | "sogan"
  | "uzum"
  | "elma"
  | "zeytin"
  | "findik"
  | "cay"
  | "diger";

export type DamageLevel = "hafif" | "orta" | "agir" | "tam_kayip";

// Sera hasar kalemi
export interface GreenhouseDamageItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  damagePercentage: number;
  totalDamage: number;
}

export interface DamageRecord {
  id: string;
  disasterType: DisasterType;
  disasterDate: string;
  reportDate: string;
  location: {
    provinceId: number;
    provinceName: string;
    districtId: number;
    districtName: string;
    neighborhood: string;
    village: string;
    parcelNo: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  farmer: {
    name: string;
    tcNo: string;
    phone: string;
    address: string;
  };
  crop: {
    type: CropType;
    customType?: string;
    area: number; // dekar
    plantingDate: string;
    expectedHarvestDate: string;
  };
  damage: {
    level: DamageLevel;
    affectedArea: number; // dekar
    damagePercentage: number; // 0-100
    description: string;
    photos?: string[];
  };
  // Sera hasarı (opsiyonel)
  greenhouse?: {
    hasGreenhouse: boolean;
    totalArea: number; // m²
    damageItems: GreenhouseDamageItem[];
    totalGreenhouseDamage: number;
  };
  cost: {
    expectedYield: number; // kg/dekar
    marketPrice: number; // TL/kg
    totalLoss: number; // TL
    inputCosts: number; // TL (tohum, gübre, ilaç vb.)
    laborCosts: number; // TL
    greenhouseDamage: number; // TL (sera hasarı)
    totalDamage: number; // TL
  };
  status: "beklemede" | "inceleniyor" | "onaylandi" | "reddedildi";
  inspector?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const DISASTER_LABELS: Record<DisasterType, string> = {
  sel_baskini: "Sel Baskını",
  su_basma: "Su Basma",
  dolu: "Dolu",
  yangin: "Yangın",
  hortum: "Hortum",
  firtina: "Fırtına",
};

export const CROP_LABELS: Record<CropType, string> = {
  bugday: "Buğday",
  arpa: "Arpa",
  misir: "Mısır",
  aycicegi: "Ayçiçeği",
  pamuk: "Pamuk",
  seker_pancari: "Şeker Pancarı",
  domates: "Domates",
  biber: "Biber",
  patates: "Patates",
  sogan: "Soğan",
  uzum: "Üzüm",
  elma: "Elma",
  zeytin: "Zeytin",
  findik: "Fındık",
  cay: "Çay",
  diger: "Diğer",
};

export const DAMAGE_LEVEL_LABELS: Record<DamageLevel, string> = {
  hafif: "Hafif (%1-25)",
  orta: "Orta (%26-50)",
  agir: "Ağır (%51-75)",
  tam_kayip: "Tam Kayıp (%76-100)",
};

export const STATUS_LABELS: Record<DamageRecord["status"], string> = {
  beklemede: "Beklemede",
  inceleniyor: "İnceleniyor",
  onaylandi: "Onaylandı",
  reddedildi: "Reddedildi",
};

// Ortalama verim değerleri (kg/dekar)
export const AVERAGE_YIELDS: Record<CropType, number> = {
  bugday: 350,
  arpa: 320,
  misir: 900,
  aycicegi: 220,
  pamuk: 450,
  seker_pancari: 5500,
  domates: 4500,
  biber: 2500,
  patates: 3500,
  sogan: 3000,
  uzum: 1200,
  elma: 2500,
  zeytin: 400,
  findik: 120,
  cay: 800,
  diger: 500,
};

// Ortalama piyasa fiyatları (TL/kg) - 2024 tahmini
export const MARKET_PRICES: Record<CropType, number> = {
  bugday: 12,
  arpa: 10,
  misir: 11,
  aycicegi: 25,
  pamuk: 45,
  seker_pancari: 3,
  domates: 15,
  biber: 35,
  patates: 12,
  sogan: 10,
  uzum: 30,
  elma: 20,
  zeytin: 80,
  findik: 180,
  cay: 65,
  diger: 20,
};
