import { DamageRecord, DisasterType } from "./types";

// Demo data for initial state
export const demoRecords: DamageRecord[] = [
  {
    id: "DMG-2024-001",
    disasterType: "dolu",
    disasterDate: "2024-06-15",
    reportDate: "2024-06-16",
    location: {
      provinceId: 7,
      provinceName: "Antalya",
      districtId: 717,
      districtName: "Manavgat",
      village: "Yeşilköy",
      neighborhood: "Merkez Mahallesi",
      parcelNo: "123-45",
    },
    farmer: {
      name: "Ahmet Yılmaz",
      tcNo: "12345678901",
      phone: "05321234567",
      address: "Yeşilköy Merkez Mah. No:15",
    },
    crop: {
      type: "bugday",
      area: 50,
      plantingDate: "2023-10-15",
      expectedHarvestDate: "2024-07-01",
    },
    damage: {
      level: "agir",
      affectedArea: 45,
      damagePercentage: 70,
      description: "Dolu yağışı sonucu başaklar zarar görmüş, taneler dökülmüş.",
    },
    cost: {
      expectedYield: 350,
      marketPrice: 12,
      totalLoss: 132300,
      inputCosts: 25000,
      laborCosts: 8000,
      greenhouseDamage: 0,
      totalDamage: 165300,
    },
    status: "onaylandi",
    inspector: "Mehmet Kaya",
    createdAt: "2024-06-16T10:30:00Z",
    updatedAt: "2024-06-20T14:00:00Z",
  },
  {
    id: "DMG-2024-002",
    disasterType: "sel_baskini",
    disasterDate: "2024-07-20",
    reportDate: "2024-07-21",
    location: {
      provinceId: 42,
      provinceName: "Konya",
      districtId: 4209,
      districtName: "Çumra",
      village: "Akarsu",
      neighborhood: "Çay Mahallesi",
      parcelNo: "67-89",
    },
    farmer: {
      name: "Fatma Demir",
      tcNo: "98765432109",
      phone: "05339876543",
      address: "Akarsu Çay Mah. No:42",
    },
    crop: {
      type: "misir",
      area: 80,
      plantingDate: "2024-04-20",
      expectedHarvestDate: "2024-09-15",
    },
    damage: {
      level: "tam_kayip",
      affectedArea: 80,
      damagePercentage: 100,
      description: "Sel suları tarlaları tamamen kaplamış, tüm ürün telef olmuş.",
    },
    cost: {
      expectedYield: 900,
      marketPrice: 11,
      totalLoss: 792000,
      inputCosts: 45000,
      laborCosts: 15000,
      greenhouseDamage: 0,
      totalDamage: 852000,
    },
    status: "inceleniyor",
    createdAt: "2024-07-21T08:15:00Z",
    updatedAt: "2024-07-21T08:15:00Z",
  },
  {
    id: "DMG-2024-003",
    disasterType: "yangin",
    disasterDate: "2024-08-05",
    reportDate: "2024-08-05",
    location: {
      provinceId: 1,
      provinceName: "Adana",
      districtId: 102,
      districtName: "Ceyhan",
      village: "Sarıova",
      neighborhood: "Üst Mahalle",
      parcelNo: "234-56",
    },
    farmer: {
      name: "Ali Çelik",
      tcNo: "11122233344",
      phone: "05301112233",
      address: "Sarıova Üst Mah. No:78",
    },
    crop: {
      type: "aycicegi",
      area: 120,
      plantingDate: "2024-04-01",
      expectedHarvestDate: "2024-09-01",
    },
    damage: {
      level: "orta",
      affectedArea: 60,
      damagePercentage: 45,
      description: "Anız yangını tarlanın bir kısmına sıçramış, ayçiçekleri yanmış.",
    },
    cost: {
      expectedYield: 220,
      marketPrice: 25,
      totalLoss: 148500,
      inputCosts: 18000,
      laborCosts: 6000,
      greenhouseDamage: 0,
      totalDamage: 172500,
    },
    status: "beklemede",
    createdAt: "2024-08-05T16:45:00Z",
    updatedAt: "2024-08-05T16:45:00Z",
  },
  {
    id: "DMG-2024-004",
    disasterType: "firtina",
    disasterDate: "2024-05-28",
    reportDate: "2024-05-29",
    location: {
      provinceId: 32,
      provinceName: "Isparta",
      districtId: 3201,
      districtName: "Merkez",
      village: "Kavakpınar",
      neighborhood: "Bağlar Mahallesi",
      parcelNo: "456-78",
    },
    farmer: {
      name: "Ayşe Özkan",
      tcNo: "55566677788",
      phone: "05425556677",
      address: "Kavakpınar Bağlar Mah. No:23",
    },
    crop: {
      type: "elma",
      area: 25,
      plantingDate: "2020-03-15",
      expectedHarvestDate: "2024-09-20",
    },
    damage: {
      level: "hafif",
      affectedArea: 10,
      damagePercentage: 20,
      description: "Şiddetli rüzgar bazı ağaçların dallarını kırmış.",
    },
    cost: {
      expectedYield: 2500,
      marketPrice: 20,
      totalLoss: 100000,
      inputCosts: 8000,
      laborCosts: 3000,
      greenhouseDamage: 0,
      totalDamage: 111000,
    },
    status: "onaylandi",
    inspector: "Zeynep Arslan",
    createdAt: "2024-05-29T11:20:00Z",
    updatedAt: "2024-06-02T09:30:00Z",
  },
  {
    id: "DMG-2024-005",
    disasterType: "hortum",
    disasterDate: "2024-04-12",
    reportDate: "2024-04-12",
    location: {
      provinceId: 7,
      provinceName: "Antalya",
      districtId: 716,
      districtName: "Kumluca",
      village: "Kızıltepe",
      neighborhood: "Yeni Mahalle",
      parcelNo: "789-01",
    },
    farmer: {
      name: "Mustafa Şahin",
      tcNo: "99988877766",
      phone: "05369998877",
      address: "Kızıltepe Yeni Mah. No:56",
    },
    crop: {
      type: "domates",
      area: 15,
      plantingDate: "2024-03-01",
      expectedHarvestDate: "2024-07-15",
    },
    damage: {
      level: "tam_kayip",
      affectedArea: 15,
      damagePercentage: 100,
      description: "Hortum sera ve açık alan fidelerini tamamen yok etmiş.",
    },
    greenhouse: {
      hasGreenhouse: true,
      totalArea: 2000,
      damageItems: [
        {
          materialId: "plastik_ortu_sera",
          materialName: "Plastik Örtülü Sera",
          quantity: 2000,
          unit: "m²",
          unitPrice: 2600,
          damagePercentage: 100,
          totalDamage: 5200000,
        }
      ],
      totalGreenhouseDamage: 5200000,
    },
    cost: {
      expectedYield: 4500,
      marketPrice: 15,
      totalLoss: 1012500,
      inputCosts: 35000,
      laborCosts: 12000,
      greenhouseDamage: 5200000,
      totalDamage: 6259500,
    },
    status: "reddedildi",
    inspector: "Hasan Yıldız",
    notes: "Sigorta kapsamında zaten karşılanmış.",
    createdAt: "2024-04-12T14:00:00Z",
    updatedAt: "2024-04-18T16:30:00Z",
  },
];

// Statistics helpers
export function getStatistics(records: DamageRecord[]) {
  const totalRecords = records.length;
  const totalDamage = records.reduce((sum, r) => sum + r.cost.totalDamage, 0);
  const totalAffectedArea = records.reduce((sum, r) => sum + r.damage.affectedArea, 0);
  
  const byDisasterType = records.reduce((acc, r) => {
    acc[r.disasterType] = (acc[r.disasterType] || 0) + 1;
    return acc;
  }, {} as Record<DisasterType, number>);

  const byStatus = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const damageByDisasterType = records.reduce((acc, r) => {
    acc[r.disasterType] = (acc[r.disasterType] || 0) + r.cost.totalDamage;
    return acc;
  }, {} as Record<DisasterType, number>);

  return {
    totalRecords,
    totalDamage,
    totalAffectedArea,
    byDisasterType,
    byStatus,
    damageByDisasterType,
    averageDamage: totalRecords > 0 ? totalDamage / totalRecords : 0,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
