// Antalya Büyükşehir Belediyesi Günlük Hal Fiyatları
// Kaynak: https://antalya.bel.tr/halden-gunluk-fiyatlar
// Son güncelleme: 2024

export interface MarketPrice {
  name: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
  category: "sebze" | "meyve";
  lastUpdated: string;
}

// Antalya Hal Fiyatları (TL)
export const ANTALYA_HAL_PRICES: MarketPrice[] = [
  // Meyveler
  { name: "Ahududu", minPrice: 70, maxPrice: 90, avgPrice: 80, unit: "Pk/125g", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Ananas", minPrice: 60, maxPrice: 75, avgPrice: 67.5, unit: "Adet", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Armut (Santamariya)", minPrice: 40, maxPrice: 60, avgPrice: 50, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Avokado", minPrice: 25, maxPrice: 45, avgPrice: 35, unit: "Adet", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Çilek", minPrice: 45, maxPrice: 95, avgPrice: 70, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Elma (Golden)", minPrice: 25, maxPrice: 37, avgPrice: 31, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Elma (Granny Smith)", minPrice: 30, maxPrice: 50, avgPrice: 40, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Elma (Starking)", minPrice: 20, maxPrice: 37, avgPrice: 28.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Erik (Yeşil)", minPrice: 30, maxPrice: 120, avgPrice: 75, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Greyfurt", minPrice: 10, maxPrice: 20, avgPrice: 15, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Karpuz", minPrice: 7, maxPrice: 18, avgPrice: 12.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Kavun", minPrice: 12, maxPrice: 25, avgPrice: 18.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Kayısı", minPrice: 25, maxPrice: 60, avgPrice: 42.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Kiraz", minPrice: 45, maxPrice: 120, avgPrice: 82.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Limon", minPrice: 20, maxPrice: 35, avgPrice: 27.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Mandalina", minPrice: 15, maxPrice: 30, avgPrice: 22.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Mango", minPrice: 100, maxPrice: 180, avgPrice: 140, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Muz", minPrice: 30, maxPrice: 55, avgPrice: 42.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Nar", minPrice: 25, maxPrice: 50, avgPrice: 37.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Portakal", minPrice: 12, maxPrice: 25, avgPrice: 18.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Şeftali", minPrice: 30, maxPrice: 60, avgPrice: 45, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Üzüm (Beyaz)", minPrice: 35, maxPrice: 70, avgPrice: 52.5, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  { name: "Üzüm (Siyah)", minPrice: 40, maxPrice: 80, avgPrice: 60, unit: "Kg", category: "meyve", lastUpdated: "2024-06-15" },
  
  // Sebzeler
  { name: "Biber (Dolma)", minPrice: 20, maxPrice: 38, avgPrice: 29, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Biber (Sivri)", minPrice: 25, maxPrice: 43, avgPrice: 34, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Biber (Kapya)", minPrice: 30, maxPrice: 50, avgPrice: 40, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Biber (Çarliston)", minPrice: 25, maxPrice: 45, avgPrice: 35, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Brokoli", minPrice: 20, maxPrice: 50, avgPrice: 35, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Domates", minPrice: 13, maxPrice: 24, avgPrice: 18.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Domates (Cherry)", minPrice: 35, maxPrice: 55, avgPrice: 45, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Domates (Pembe)", minPrice: 15, maxPrice: 30, avgPrice: 22.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Fasulye", minPrice: 20, maxPrice: 32, avgPrice: 26, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Havuç", minPrice: 10, maxPrice: 17, avgPrice: 13.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Hıyar", minPrice: 15, maxPrice: 30, avgPrice: 22.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Ispanak", minPrice: 13, maxPrice: 20, avgPrice: 16.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Kabak (Sakız)", minPrice: 10, maxPrice: 25, avgPrice: 17.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Kabak (Bal)", minPrice: 17, maxPrice: 25, avgPrice: 21, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Karnabahar", minPrice: 30, maxPrice: 40, avgPrice: 35, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Lahana", minPrice: 8, maxPrice: 15, avgPrice: 11.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Marul", minPrice: 8, maxPrice: 15, avgPrice: 11.5, unit: "Adet", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Maydanoz", minPrice: 5, maxPrice: 10, avgPrice: 7.5, unit: "Bağ", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Patlıcan", minPrice: 15, maxPrice: 30, avgPrice: 22.5, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Patates", minPrice: 12, maxPrice: 20, avgPrice: 16, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Pırasa", minPrice: 12, maxPrice: 22, avgPrice: 17, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Salatalık", minPrice: 12, maxPrice: 22, avgPrice: 17, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Soğan (Kuru)", minPrice: 10, maxPrice: 18, avgPrice: 14, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Soğan (Yeşil)", minPrice: 5, maxPrice: 10, avgPrice: 7.5, unit: "Bağ", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Sarımsak", minPrice: 60, maxPrice: 100, avgPrice: 80, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
  { name: "Turp", minPrice: 10, maxPrice: 18, avgPrice: 14, unit: "Kg", category: "sebze", lastUpdated: "2024-06-15" },
];

// Çevre, Şehircilik ve İklim Değişikliği Bakanlığı
// 2026 Yılı Yapı Yaklaşık Birim Maliyetleri
// Kaynak: Resmi Gazete 03.02.2026 - Sayı: 33157

export interface GreenhouseMaterial {
  id: string;
  name: string;
  description: string;
  unitPrice: number; // TL/m²
  unit: string;
  category: "sera_ortu" | "sera_yapi" | "sulama" | "isitma" | "diger";
  officialSource: string;
}

export const GREENHOUSE_MATERIALS: GreenhouseMaterial[] = [
  // Sera Örtü Malzemeleri
  {
    id: "plastik_ortu_sera",
    name: "Plastik Örtülü Sera",
    description: "Tek kat PE plastik örtülü sera (çelik konstrüksiyon dahil)",
    unitPrice: 2600,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Çevre ve Şehircilik Bakanlığı 2026 Birim Fiyatları"
  },
  {
    id: "cam_sera",
    name: "Cam veya Sert Plastik Örtülü Sera",
    description: "Cam veya polikarbonat örtülü sera (çelik konstrüksiyon dahil)",
    unitPrice: 3900,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Çevre ve Şehircilik Bakanlığı 2026 Birim Fiyatları"
  },
  {
    id: "pe_plastik_tek_kat",
    name: "PE Plastik Örtü (Tek Kat)",
    description: "150-200 mikron PE sera naylonu",
    unitPrice: 45,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "pe_plastik_cift_kat",
    name: "PE Plastik Örtü (Çift Kat)",
    description: "150-200 mikron PE sera naylonu çift kat",
    unitPrice: 85,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "polikarbonat_ortu",
    name: "Polikarbonat Örtü",
    description: "4-6mm polikarbonat levha",
    unitPrice: 350,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "cam_ortu",
    name: "Cam Örtü",
    description: "4mm temperli sera camı",
    unitPrice: 450,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "golgeleme_file",
    name: "Gölgeleme Filesi",
    description: "%55-75 gölgeleme oranlı file",
    unitPrice: 35,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "bocek_tulu",
    name: "Böcek Tülü",
    description: "50-80 mesh böcek tülü",
    unitPrice: 25,
    unit: "m²",
    category: "sera_ortu",
    officialSource: "Piyasa Rayici 2024"
  },
  
  // Sera Yapı Malzemeleri
  {
    id: "celik_konstruksiyon",
    name: "Çelik Konstrüksiyon (Galvanizli)",
    description: "Galvanizli çelik sera iskeleti",
    unitPrice: 1200,
    unit: "m²",
    category: "sera_yapi",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "ahsap_konstruksiyon",
    name: "Ahşap Konstrüksiyon",
    description: "Emprenye ahşap sera iskeleti",
    unitPrice: 650,
    unit: "m²",
    category: "sera_yapi",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "beton_temel",
    name: "Beton Temel",
    description: "Sera beton temel sistemi",
    unitPrice: 180,
    unit: "m²",
    category: "sera_yapi",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "havalandirma_pencere",
    name: "Havalandırma Penceresi",
    description: "Yan ve tavan havalandırma sistemi",
    unitPrice: 280,
    unit: "m²",
    category: "sera_yapi",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "kapi_sistemi",
    name: "Sera Kapı Sistemi",
    description: "Çift kanatlı sera kapısı",
    unitPrice: 8500,
    unit: "Adet",
    category: "sera_yapi",
    officialSource: "Piyasa Rayici 2024"
  },
  
  // Sulama Sistemleri
  {
    id: "damla_sulama",
    name: "Damla Sulama Sistemi",
    description: "Tam otomatik damla sulama sistemi",
    unitPrice: 45,
    unit: "m²",
    category: "sulama",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "yagmurlama_sulama",
    name: "Yağmurlama Sulama Sistemi",
    description: "Sera içi yağmurlama sistemi",
    unitPrice: 35,
    unit: "m²",
    category: "sulama",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "sulama_pompasi",
    name: "Sulama Pompası",
    description: "2-5 HP elektrikli pompa",
    unitPrice: 12000,
    unit: "Adet",
    category: "sulama",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "su_deposu",
    name: "Su Deposu",
    description: "5000 Lt polyester su deposu",
    unitPrice: 8500,
    unit: "Adet",
    category: "sulama",
    officialSource: "Piyasa Rayici 2024"
  },
  
  // Isıtma Sistemleri
  {
    id: "sicak_hava_ureticisi",
    name: "Sıcak Hava Üreticisi",
    description: "Motorin/doğalgaz sıcak hava jeneratörü",
    unitPrice: 45000,
    unit: "Adet",
    category: "isitma",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "sicak_su_kazani",
    name: "Sıcak Su Kazanı",
    description: "Merkezi ısıtma için sıcak su kazanı",
    unitPrice: 85000,
    unit: "Adet",
    category: "isitma",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "isitma_borusu",
    name: "Isıtma Borusu (Yere Döşeme)",
    description: "Sıcak su yere döşeme sistemi",
    unitPrice: 120,
    unit: "m²",
    category: "isitma",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "jeotermal_isitma",
    name: "Jeotermal Isıtma Sistemi",
    description: "Jeotermal enerji ile ısıtma",
    unitPrice: 250,
    unit: "m²",
    category: "isitma",
    officialSource: "Piyasa Rayici 2024"
  },
  
  // Diğer Ekipmanlar
  {
    id: "fan_sistemi",
    name: "Havalandırma Fan Sistemi",
    description: "Endüstriyel sera fanı",
    unitPrice: 15000,
    unit: "Adet",
    category: "diger",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "otomasyon_sistemi",
    name: "Sera Otomasyon Sistemi",
    description: "İklim kontrol ve otomasyon sistemi",
    unitPrice: 85,
    unit: "m²",
    category: "diger",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "aydinlatma",
    name: "Sera Aydınlatma Sistemi",
    description: "LED büyüme ışıkları",
    unitPrice: 180,
    unit: "m²",
    category: "diger",
    officialSource: "Piyasa Rayici 2024"
  },
  {
    id: "yetiştirme_kasasi",
    name: "Yetiştirme Kasası/Saksı",
    description: "Plastik yetiştirme kasası",
    unitPrice: 45,
    unit: "Adet",
    category: "diger",
    officialSource: "Piyasa Rayici 2024"
  },
];

// Kategori etiketleri
export const GREENHOUSE_CATEGORY_LABELS: Record<GreenhouseMaterial["category"], string> = {
  sera_ortu: "Sera Örtü Malzemeleri",
  sera_yapi: "Sera Yapı Malzemeleri",
  sulama: "Sulama Sistemleri",
  isitma: "Isıtma Sistemleri",
  diger: "Diğer Ekipmanlar",
};

// Ürün fiyatını bul (hal fiyatlarından)
export function findMarketPrice(productName: string): MarketPrice | undefined {
  const normalizedName = productName.toLowerCase().trim();
  return ANTALYA_HAL_PRICES.find(p => 
    p.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(p.name.toLowerCase())
  );
}

// Sera maliyetini hesapla
export function calculateGreenhouseCost(materialId: string, quantity: number): number {
  const material = GREENHOUSE_MATERIALS.find(m => m.id === materialId);
  if (!material) return 0;
  return material.unitPrice * quantity;
}

// Toplam sera hasarını hesapla
export function calculateTotalGreenhouseDamage(
  items: Array<{ materialId: string; quantity: number; damagePercentage: number }>
): number {
  return items.reduce((total, item) => {
    const material = GREENHOUSE_MATERIALS.find(m => m.id === item.materialId);
    if (!material) return total;
    return total + (material.unitPrice * item.quantity * (item.damagePercentage / 100));
  }, 0);
}
