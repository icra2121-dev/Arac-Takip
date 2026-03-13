// Türkiye İl, İlçe, Mahalle/Köy verileri
// Kaynak: turkiyeapi.dev

export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  provinceId: number;
}

export interface Neighborhood {
  id: number;
  name: string;
  districtId: number;
}

// Türkiye'nin 81 ili
export const PROVINCES: Province[] = [
  { id: 1, name: "Adana" },
  { id: 2, name: "Adıyaman" },
  { id: 3, name: "Afyonkarahisar" },
  { id: 4, name: "Ağrı" },
  { id: 5, name: "Amasya" },
  { id: 6, name: "Ankara" },
  { id: 7, name: "Antalya" },
  { id: 8, name: "Artvin" },
  { id: 9, name: "Aydın" },
  { id: 10, name: "Balıkesir" },
  { id: 11, name: "Bilecik" },
  { id: 12, name: "Bingöl" },
  { id: 13, name: "Bitlis" },
  { id: 14, name: "Bolu" },
  { id: 15, name: "Burdur" },
  { id: 16, name: "Bursa" },
  { id: 17, name: "Çanakkale" },
  { id: 18, name: "Çankırı" },
  { id: 19, name: "Çorum" },
  { id: 20, name: "Denizli" },
  { id: 21, name: "Diyarbakır" },
  { id: 22, name: "Edirne" },
  { id: 23, name: "Elazığ" },
  { id: 24, name: "Erzincan" },
  { id: 25, name: "Erzurum" },
  { id: 26, name: "Eskişehir" },
  { id: 27, name: "Gaziantep" },
  { id: 28, name: "Giresun" },
  { id: 29, name: "Gümüşhane" },
  { id: 30, name: "Hakkari" },
  { id: 31, name: "Hatay" },
  { id: 32, name: "Isparta" },
  { id: 33, name: "Mersin" },
  { id: 34, name: "İstanbul" },
  { id: 35, name: "İzmir" },
  { id: 36, name: "Kars" },
  { id: 37, name: "Kastamonu" },
  { id: 38, name: "Kayseri" },
  { id: 39, name: "Kırklareli" },
  { id: 40, name: "Kırşehir" },
  { id: 41, name: "Kocaeli" },
  { id: 42, name: "Konya" },
  { id: 43, name: "Kütahya" },
  { id: 44, name: "Malatya" },
  { id: 45, name: "Manisa" },
  { id: 46, name: "Kahramanmaraş" },
  { id: 47, name: "Mardin" },
  { id: 48, name: "Muğla" },
  { id: 49, name: "Muş" },
  { id: 50, name: "Nevşehir" },
  { id: 51, name: "Niğde" },
  { id: 52, name: "Ordu" },
  { id: 53, name: "Rize" },
  { id: 54, name: "Sakarya" },
  { id: 55, name: "Samsun" },
  { id: 56, name: "Siirt" },
  { id: 57, name: "Sinop" },
  { id: 58, name: "Sivas" },
  { id: 59, name: "Tekirdağ" },
  { id: 60, name: "Tokat" },
  { id: 61, name: "Trabzon" },
  { id: 62, name: "Tunceli" },
  { id: 63, name: "Şanlıurfa" },
  { id: 64, name: "Uşak" },
  { id: 65, name: "Van" },
  { id: 66, name: "Yozgat" },
  { id: 67, name: "Zonguldak" },
  { id: 68, name: "Aksaray" },
  { id: 69, name: "Bayburt" },
  { id: 70, name: "Karaman" },
  { id: 71, name: "Kırıkkale" },
  { id: 72, name: "Batman" },
  { id: 73, name: "Şırnak" },
  { id: 74, name: "Bartın" },
  { id: 75, name: "Ardahan" },
  { id: 76, name: "Iğdır" },
  { id: 77, name: "Yalova" },
  { id: 78, name: "Karabük" },
  { id: 79, name: "Kilis" },
  { id: 80, name: "Osmaniye" },
  { id: 81, name: "Düzce" },
];

// İlçeler (örnek olarak bazı iller için tam liste, diğerleri için merkez ilçeler)
export const DISTRICTS: Record<number, District[]> = {
  1: [ // Adana
    { id: 101, name: "Aladağ", provinceId: 1 },
    { id: 102, name: "Ceyhan", provinceId: 1 },
    { id: 103, name: "Çukurova", provinceId: 1 },
    { id: 104, name: "Feke", provinceId: 1 },
    { id: 105, name: "İmamoğlu", provinceId: 1 },
    { id: 106, name: "Karaisalı", provinceId: 1 },
    { id: 107, name: "Karataş", provinceId: 1 },
    { id: 108, name: "Kozan", provinceId: 1 },
    { id: 109, name: "Pozantı", provinceId: 1 },
    { id: 110, name: "Saimbeyli", provinceId: 1 },
    { id: 111, name: "Sarıçam", provinceId: 1 },
    { id: 112, name: "Seyhan", provinceId: 1 },
    { id: 113, name: "Tufanbeyli", provinceId: 1 },
    { id: 114, name: "Yumurtalık", provinceId: 1 },
    { id: 115, name: "Yüreğir", provinceId: 1 },
  ],
  6: [ // Ankara
    { id: 601, name: "Akyurt", provinceId: 6 },
    { id: 602, name: "Altındağ", provinceId: 6 },
    { id: 603, name: "Ayaş", provinceId: 6 },
    { id: 604, name: "Balâ", provinceId: 6 },
    { id: 605, name: "Beypazarı", provinceId: 6 },
    { id: 606, name: "Çamlıdere", provinceId: 6 },
    { id: 607, name: "Çankaya", provinceId: 6 },
    { id: 608, name: "Çubuk", provinceId: 6 },
    { id: 609, name: "Elmadağ", provinceId: 6 },
    { id: 610, name: "Etimesgut", provinceId: 6 },
    { id: 611, name: "Evren", provinceId: 6 },
    { id: 612, name: "Gölbaşı", provinceId: 6 },
    { id: 613, name: "Güdül", provinceId: 6 },
    { id: 614, name: "Haymana", provinceId: 6 },
    { id: 615, name: "Kahramankazan", provinceId: 6 },
    { id: 616, name: "Kalecik", provinceId: 6 },
    { id: 617, name: "Keçiören", provinceId: 6 },
    { id: 618, name: "Kızılcahamam", provinceId: 6 },
    { id: 619, name: "Mamak", provinceId: 6 },
    { id: 620, name: "Nallıhan", provinceId: 6 },
    { id: 621, name: "Polatlı", provinceId: 6 },
    { id: 622, name: "Pursaklar", provinceId: 6 },
    { id: 623, name: "Sincan", provinceId: 6 },
    { id: 624, name: "Şereflikoçhisar", provinceId: 6 },
    { id: 625, name: "Yenimahalle", provinceId: 6 },
  ],
  7: [ // Antalya
    { id: 701, name: "Akseki", provinceId: 7 },
    { id: 702, name: "Aksu", provinceId: 7 },
    { id: 703, name: "Alanya", provinceId: 7 },
    { id: 704, name: "Demre", provinceId: 7 },
    { id: 705, name: "Döşemealtı", provinceId: 7 },
    { id: 706, name: "Elmalı", provinceId: 7 },
    { id: 707, name: "Finike", provinceId: 7 },
    { id: 708, name: "Gazipaşa", provinceId: 7 },
    { id: 709, name: "Gündoğmuş", provinceId: 7 },
    { id: 710, name: "İbradı", provinceId: 7 },
    { id: 711, name: "Kaş", provinceId: 7 },
    { id: 712, name: "Kemer", provinceId: 7 },
    { id: 713, name: "Kepez", provinceId: 7 },
    { id: 714, name: "Konyaaltı", provinceId: 7 },
    { id: 715, name: "Korkuteli", provinceId: 7 },
    { id: 716, name: "Kumluca", provinceId: 7 },
    { id: 717, name: "Manavgat", provinceId: 7 },
    { id: 718, name: "Muratpaşa", provinceId: 7 },
    { id: 719, name: "Serik", provinceId: 7 },
  ],
  34: [ // İstanbul
    { id: 3401, name: "Adalar", provinceId: 34 },
    { id: 3402, name: "Arnavutköy", provinceId: 34 },
    { id: 3403, name: "Ataşehir", provinceId: 34 },
    { id: 3404, name: "Avcılar", provinceId: 34 },
    { id: 3405, name: "Bağcılar", provinceId: 34 },
    { id: 3406, name: "Bahçelievler", provinceId: 34 },
    { id: 3407, name: "Bakırköy", provinceId: 34 },
    { id: 3408, name: "Başakşehir", provinceId: 34 },
    { id: 3409, name: "Bayrampaşa", provinceId: 34 },
    { id: 3410, name: "Beşiktaş", provinceId: 34 },
    { id: 3411, name: "Beykoz", provinceId: 34 },
    { id: 3412, name: "Beylikdüzü", provinceId: 34 },
    { id: 3413, name: "Beyoğlu", provinceId: 34 },
    { id: 3414, name: "Büyükçekmece", provinceId: 34 },
    { id: 3415, name: "Çatalca", provinceId: 34 },
    { id: 3416, name: "Çekmeköy", provinceId: 34 },
    { id: 3417, name: "Esenler", provinceId: 34 },
    { id: 3418, name: "Esenyurt", provinceId: 34 },
    { id: 3419, name: "Eyüpsultan", provinceId: 34 },
    { id: 3420, name: "Fatih", provinceId: 34 },
    { id: 3421, name: "Gaziosmanpaşa", provinceId: 34 },
    { id: 3422, name: "Güngören", provinceId: 34 },
    { id: 3423, name: "Kadıköy", provinceId: 34 },
    { id: 3424, name: "Kağıthane", provinceId: 34 },
    { id: 3425, name: "Kartal", provinceId: 34 },
    { id: 3426, name: "Küçükçekmece", provinceId: 34 },
    { id: 3427, name: "Maltepe", provinceId: 34 },
    { id: 3428, name: "Pendik", provinceId: 34 },
    { id: 3429, name: "Sancaktepe", provinceId: 34 },
    { id: 3430, name: "Sarıyer", provinceId: 34 },
    { id: 3431, name: "Silivri", provinceId: 34 },
    { id: 3432, name: "Sultanbeyli", provinceId: 34 },
    { id: 3433, name: "Sultangazi", provinceId: 34 },
    { id: 3434, name: "Şile", provinceId: 34 },
    { id: 3435, name: "Şişli", provinceId: 34 },
    { id: 3436, name: "Tuzla", provinceId: 34 },
    { id: 3437, name: "Ümraniye", provinceId: 34 },
    { id: 3438, name: "Üsküdar", provinceId: 34 },
    { id: 3439, name: "Zeytinburnu", provinceId: 34 },
  ],
  35: [ // İzmir
    { id: 3501, name: "Aliağa", provinceId: 35 },
    { id: 3502, name: "Balçova", provinceId: 35 },
    { id: 3503, name: "Bayındır", provinceId: 35 },
    { id: 3504, name: "Bayraklı", provinceId: 35 },
    { id: 3505, name: "Bergama", provinceId: 35 },
    { id: 3506, name: "Beydağ", provinceId: 35 },
    { id: 3507, name: "Bornova", provinceId: 35 },
    { id: 3508, name: "Buca", provinceId: 35 },
    { id: 3509, name: "Çeşme", provinceId: 35 },
    { id: 3510, name: "Çiğli", provinceId: 35 },
    { id: 3511, name: "Dikili", provinceId: 35 },
    { id: 3512, name: "Foça", provinceId: 35 },
    { id: 3513, name: "Gaziemir", provinceId: 35 },
    { id: 3514, name: "Güzelbahçe", provinceId: 35 },
    { id: 3515, name: "Karabağlar", provinceId: 35 },
    { id: 3516, name: "Karaburun", provinceId: 35 },
    { id: 3517, name: "Karşıyaka", provinceId: 35 },
    { id: 3518, name: "Kemalpaşa", provinceId: 35 },
    { id: 3519, name: "Kınık", provinceId: 35 },
    { id: 3520, name: "Kiraz", provinceId: 35 },
    { id: 3521, name: "Konak", provinceId: 35 },
    { id: 3522, name: "Menderes", provinceId: 35 },
    { id: 3523, name: "Menemen", provinceId: 35 },
    { id: 3524, name: "Narlıdere", provinceId: 35 },
    { id: 3525, name: "Ödemiş", provinceId: 35 },
    { id: 3526, name: "Seferihisar", provinceId: 35 },
    { id: 3527, name: "Selçuk", provinceId: 35 },
    { id: 3528, name: "Tire", provinceId: 35 },
    { id: 3529, name: "Torbalı", provinceId: 35 },
    { id: 3530, name: "Urla", provinceId: 35 },
  ],
  42: [ // Konya
    { id: 4201, name: "Ahırlı", provinceId: 42 },
    { id: 4202, name: "Akören", provinceId: 42 },
    { id: 4203, name: "Akşehir", provinceId: 42 },
    { id: 4204, name: "Altınekin", provinceId: 42 },
    { id: 4205, name: "Beyşehir", provinceId: 42 },
    { id: 4206, name: "Bozkır", provinceId: 42 },
    { id: 4207, name: "Cihanbeyli", provinceId: 42 },
    { id: 4208, name: "Çeltik", provinceId: 42 },
    { id: 4209, name: "Çumra", provinceId: 42 },
    { id: 4210, name: "Derbent", provinceId: 42 },
    { id: 4211, name: "Derebucak", provinceId: 42 },
    { id: 4212, name: "Doğanhisar", provinceId: 42 },
    { id: 4213, name: "Emirgazi", provinceId: 42 },
    { id: 4214, name: "Ereğli", provinceId: 42 },
    { id: 4215, name: "Güneysınır", provinceId: 42 },
    { id: 4216, name: "Hadim", provinceId: 42 },
    { id: 4217, name: "Halkapınar", provinceId: 42 },
    { id: 4218, name: "Hüyük", provinceId: 42 },
    { id: 4219, name: "Ilgın", provinceId: 42 },
    { id: 4220, name: "Kadınhanı", provinceId: 42 },
    { id: 4221, name: "Karapınar", provinceId: 42 },
    { id: 4222, name: "Karatay", provinceId: 42 },
    { id: 4223, name: "Kulu", provinceId: 42 },
    { id: 4224, name: "Meram", provinceId: 42 },
    { id: 4225, name: "Sarayönü", provinceId: 42 },
    { id: 4226, name: "Selçuklu", provinceId: 42 },
    { id: 4227, name: "Seydişehir", provinceId: 42 },
    { id: 4228, name: "Taşkent", provinceId: 42 },
    { id: 4229, name: "Tuzlukçu", provinceId: 42 },
    { id: 4230, name: "Yalıhüyük", provinceId: 42 },
    { id: 4231, name: "Yunak", provinceId: 42 },
  ],
};

// Diğer iller için varsayılan merkez ilçe ekle
PROVINCES.forEach(province => {
  if (!DISTRICTS[province.id]) {
    DISTRICTS[province.id] = [
      { id: province.id * 100 + 1, name: "Merkez", provinceId: province.id }
    ];
  }
});

// Örnek mahalle/köy verileri (her ilçe için)
export const NEIGHBORHOODS: Record<number, string[]> = {
  // Antalya - Aksu
  702: ["Altıntaş", "Bahtılı", "Barbaros", "Çalkaya", "Fettahlı", "Hacıali", "Karaçallı", "Kemerağzı", "Kundu", "Macun", "Mandırlar", "Pınarbaşı", "Solak", "Topallı", "Yeşilkaraman", "Yurtpınar"],
  // Antalya - Kepez
  713: ["Altınova", "Antalya", "Baraj", "Düden", "Emek", "Fabrikalar", "Gaziler", "Göksu", "Güneş", "Habipler", "Hüsnü Karakaş", "Karşıyaka", "Koyunlar", "Kuzeyyaka", "Lara", "Orta", "Özgürlük", "Santral", "Sütçüler", "Teomanpaşa", "Ulus", "Varsak Esentepe", "Yeni Emek", "Zeytinlik"],
  // Antalya - Muratpaşa
  718: ["Bahçelievler", "Balbey", "Barbaros", "Çağlayan", "Deniz", "Doğuyaka", "Elmalı", "Ermenek", "Etiler", "Fener", "Güzeloba", "Haşimişcan", "Kızılarık", "Kızıltoprak", "Konuksever", "Meltem", "Meydankavağı", "Selçuk", "Sinan", "Şirinyalı", "Tahılpazarı", "Tarım", "Topçular", "Yenigün", "Yeşilbahçe", "Zerdalilik"],
  // Ankara - Çankaya
  607: ["Ahlatlıbel", "Akpınar", "Aşağı Öveçler", "Ayrancı", "Bahçelievler", "Balgat", "Birlik", "Büyükesat", "Çayyolu", "Çiğdem", "Çukurambar", "Devlet", "Dikmen", "Emek", "Esat", "Gaziosmanpaşa", "Güvenevler", "Hilal", "İleri", "Kavaklıdere", "Keklik", "Kırkkonaklar", "Kızılırmak", "Konutkent", "Korkutreis", "Maltepe", "Mebusevleri", "Mutlukent", "Öveçler", "Seyranbağları", "Sıhhiye", "Sokullu", "Söğütözü", "Tınaztepe", "Ümitköy", "Ümitkent", "Yaşamkent", "Yıldız", "Yıldızevler", "Yukarı Dikmen"],
  // Konya - Selçuklu
  4226: ["Akademi", "Akyokuş", "Alaaddin", "Ardıçlı", "Aşkan", "Bağrıkurt", "Başak", "Binkonutlar", "Bosna Hersek", "Büsan", "Cumhuriyet", "Çandır", "Dikilitaş", "Durunday", "Feritpaşa", "Fetih", "Gazanfer", "Hacıkaymak", "Hocacihan", "Işık", "Kayacık", "Musalla Bağları", "Sakarya", "Sancak", "Sille", "Yazır", "Yeni Meram", "Yunus Emre"],
};

// Tüm ilçeler için varsayılan mahalle ekle
Object.values(DISTRICTS).flat().forEach(district => {
  if (!NEIGHBORHOODS[district.id]) {
    NEIGHBORHOODS[district.id] = ["Merkez Mahallesi", "Cumhuriyet Mahallesi", "Atatürk Mahallesi"];
  }
});

// İlçeleri il ID'sine göre getir
export function getDistrictsByProvinceId(provinceId: number): District[] {
  return DISTRICTS[provinceId] || [];
}

// Mahalleleri ilçe ID'sine göre getir
export function getNeighborhoodsByDistrictId(districtId: number): string[] {
  return NEIGHBORHOODS[districtId] || ["Merkez Mahallesi"];
}
