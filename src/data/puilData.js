// Database & Referensi Teknis PUIL 2011 & 2020 (SNI 0225:2020)

export const CABLE_CROSS_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

export const STANDARD_MCB_RATINGS = [1, 2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];

// KHA Dasar Konduktor Tembaga (Cu) Isolasi PVC pada Suhu Sekitar 30°C (Amper)
// Berdasarkan Tabel 52-C1 PUIL 2011 / PUIL 2020 (SNI IEC 60364-5-52)
export const KHA_TABLE_COPPER_PVC = {
  // Metode B1: Kabel berisolasi dalam pipa konduit pada dinding bata/beton
  B1_1PHASE: {
    1.5: 14.5,
    2.5: 19.5,
    4: 26,
    6: 34,
    10: 46,
    16: 61,
    25: 80,
    35: 99,
    50: 119,
    70: 151,
    95: 182,
    120: 210,
    150: 240,
    185: 273,
    240: 320,
  },
  B1_3PHASE: {
    1.5: 13.5,
    2.5: 18,
    4: 24,
    6: 31,
    10: 42,
    16: 56,
    25: 73,
    35: 89,
    50: 108,
    70: 136,
    95: 164,
    120: 188,
    150: 216,
    185: 245,
    240: 286,
  },
  // Metode C: Kabel berinti banyak langsung pada dinding kayu/bata
  C_1PHASE: {
    1.5: 17.5,
    2.5: 24,
    4: 32,
    6: 41,
    10: 57,
    16: 76,
    25: 101,
    35: 125,
    50: 151,
    70: 192,
    95: 232,
    120: 269,
    150: 300,
    185: 341,
    240: 400,
  },
  C_3PHASE: {
    1.5: 15.5,
    2.5: 21,
    4: 28,
    6: 36,
    10: 50,
    16: 68,
    25: 89,
    35: 110,
    50: 134,
    70: 171,
    95: 207,
    120: 239,
    150: 262,
    185: 296,
    240: 346,
  },
  // Metode E/F: Kabel di udara terbuka / nampan kabel berlubang
  AIR_1PHASE: {
    1.5: 19.5,
    2.5: 27,
    4: 36,
    6: 48,
    10: 66,
    16: 89,
    25: 118,
    35: 145,
    50: 175,
    70: 224,
    95: 271,
    120: 314,
    150: 363,
    185: 415,
    240: 490,
  },
  AIR_3PHASE: {
    1.5: 17.5,
    2.5: 24,
    4: 32,
    6: 41,
    10: 57,
    16: 76,
    25: 101,
    35: 123,
    50: 155,
    70: 198,
    95: 244,
    120: 282,
    150: 324,
    185: 371,
    240: 439,
  },
  // Metode D: Kabel ditanam dalam tanah (Direct buried / Duct)
  GROUND: {
    1.5: 22,
    2.5: 29,
    4: 38,
    6: 47,
    10: 63,
    16: 81,
    25: 104,
    35: 125,
    50: 148,
    70: 183,
    95: 216,
    120: 246,
    150: 278,
    185: 312,
    240: 361,
  }
};

// Faktor Koreksi Suhu Lingkungan (Tabel 52-D1 PUIL)
export const TEMP_CORRECTION_FACTORS = {
  PVC: {
    20: 1.12,
    25: 1.06,
    30: 1.00,
    35: 0.94,
    40: 0.87,
    45: 0.79,
    50: 0.71,
    55: 0.61,
    60: 0.50,
  },
  XLPE: {
    20: 1.08,
    25: 1.04,
    30: 1.00,
    35: 0.96,
    40: 0.91,
    45: 0.87,
    50: 0.82,
    55: 0.76,
    60: 0.71,
  }
};

// Faktor Koreksi Pengelompokan Sirkuit (Tabel 52-E1 PUIL)
export const GROUPING_FACTORS = {
  1: 1.00,
  2: 0.80,
  3: 0.70,
  4: 0.65,
  5: 0.60,
  6: 0.57,
  7: 0.54,
  8: 0.52,
  9: 0.50,
  12: 0.45,
  16: 0.41,
  20: 0.38,
};

// Tahanan Jenis Tanah (Resistivitas Tanah ρ dalam Ohm-meter)
export const SOIL_RESISTIVITY = [
  { id: 'swamp', name: 'Tanah Rawa / Gambut Basah', rho: 30, desc: 'Sangat konduktif, kelembapan tinggi sepanjang tahun' },
  { id: 'clay', name: 'Tanah Liat Basah / Humus Subur', rho: 100, desc: 'Kondisi umum pekarangan & tanah pertanian Indonesia' },
  { id: 'sandy_clay', name: 'Tanah Liat Berpasir / Agak Lembab', rho: 150, desc: 'Perumahan datar dengan kelembaban sedang' },
  { id: 'wet_sand', name: 'Pasir Basah / Tepi Danau / Pantai', rho: 200, desc: 'Daerah pesisir atau dekat sumber air terbuka' },
  { id: 'dry_sand', name: 'Pasir Kering / Kerikil Berpori', rho: 1000, desc: 'Resistivitas tinggi, butuh elektroda lebih dalam atau paralel' },
  { id: 'rocky', name: 'Tanah Berbatu / Perbukitan Kering', rho: 3000, desc: 'Sangat tinggi, disarankan sistem grid ground mat atau bentonit' },
];

// Data Perbandingan Warna Kabel SNI PUIL 2011/2020 vs PUIL 2000
export const WIRE_COLOR_COMPARISON = [
  {
    phase: 'Fasa R (L1)',
    current: { name: 'Cokelat', hex: '#8B4513', border: '#a0522d' },
    old: { name: 'Merah', hex: '#dc2626', border: '#b91c1c' },
    notes: 'Kawat aktif utama fasa 1 pada jaringan 3 fasa atau fasa tunggal.'
  },
  {
    phase: 'Fasa S (L2)',
    current: { name: 'Hitam', hex: '#1e293b', border: '#475569' },
    old: { name: 'Kuning', hex: '#eab308', border: '#ca8a04' },
    notes: 'Kawat aktif fasa 2 pada sistem 3 fasa.'
  },
  {
    phase: 'Fasa T (L3)',
    current: { name: 'Abu-abu', hex: '#94a3b8', border: '#cbd5e1' },
    old: { name: 'Hitam', hex: '#1e293b', border: '#475569' },
    notes: 'Kawat aktif fasa 3 pada sistem 3 fasa.'
  },
  {
    phase: 'Netral (N)',
    current: { name: 'Biru Muda', hex: '#0284c7', border: '#38bdf8' },
    old: { name: 'Biru', hex: '#0284c7', border: '#38bdf8' },
    notes: 'Kawat penghantar netral kembali ke titik bintang trafo/PLN.'
  },
  {
    phase: 'Proteksi / Ground (PE)',
    current: { name: 'Kuning Bergaris Hijau', hex: '#84cc16', stripe: '#16a34a', border: '#a3e635' },
    old: { name: 'Kuning Bergaris Hijau', hex: '#84cc16', stripe: '#16a34a', border: '#a3e635' },
    notes: 'Penghantar proteksi pembumian, DILARANG KERAS dipakai untuk fasa atau netral!'
  },
];

// Data Zonasi Area Basah (Kamar Mandi / Kamar Mandi Basah) PUIL Bagian 701
export const BATHROOM_ZONES = [
  {
    zone: 'Zona 0',
    title: 'Bagian Dalam Bak Mandi / Shower Tray',
    description: 'Area yang terendam air atau terkena semprotan langsung terus menerus.',
    ipRating: 'IPX7 (Tahan perendaman)',
    voltage: 'Hanya tegangan ekstra rendah aman (SELV) maks 12V AC atau 30V DC.',
    prohibited: 'Stop kontak, saklar, dan peralatan listrik 220V dilarang keras dipasang di sini.',
    badgeColor: 'border-red-500 bg-red-950/40 text-red-300'
  },
  {
    zone: 'Zona 1',
    title: 'Dinding di Atas Bak Mandi / Pancuran (s.d. 2,25 meter)',
    description: 'Area vertikal langsung di atas Zona 0 hingga ketinggian 2,25 m dari lantai.',
    ipRating: 'Minimal IPX4 (Tahan cipratan air dari segala arah)',
    voltage: 'Water heater listrik fixed-wired dengan SELV / RCD 30mA, proteksi IPX4.',
    prohibited: 'Stop kontak umum dilarang. Hanya diperkenankan unit pemanas air bersertifikat.',
    badgeColor: 'border-amber-500 bg-amber-950/40 text-amber-300'
  },
  {
    zone: 'Zona 2',
    title: 'Jarak 0,6 Meter di Luar Zona 1',
    description: 'Jangkauan radius 60 cm horizontal dari tepi bak atau Zona 1 hingga tinggi 2,25 m.',
    ipRating: 'Minimal IPX4 (Tahan percikan air)',
    voltage: 'Lampu penerangan berisolasi kelas II, shaver socket unit (trafo isolasi) diperbolehkan.',
    prohibited: 'Stop kontak biasa tanpa penutup/waterproof tetap dilarang.',
    badgeColor: 'border-blue-500 bg-blue-950/40 text-blue-300'
  },
  {
    zone: 'Di Luar Zona',
    title: 'Area Kering Kamar Mandi (> 0,6 m dari Zona 2)',
    description: 'Bagian kamar mandi yang berada di luar jangkauan langsung cipratan air.',
    ipRating: 'IPX1 atau standar indoor tertutup',
    voltage: 'Stop kontak diizinkan hanya jika diproteksi oleh RCD / GPAS sensitivitas maks 30mA.',
    prohibited: 'Hindari posisi yang mudah terkena tumpahan air lantai.',
    badgeColor: 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
  }
];

// Direktori Pasal Kunci & Tanya Jawab Populer PUIL
export const PUIL_ARTICLES = [
  {
    id: 'kabel-minimum',
    title: 'Ukuran Penampang Kabel Minimal Instalasi Rumah',
    category: 'Kabel & KHA',
    pasal: 'PUIL 2011/2020 Bagian 524.1 (Tabel 52.2)',
    summary: 'Penampang konduktor tembaga untuk rangkaian penerangan minimal 1,5 mm², dan rangkaian stop kontak / daya minimal 2,5 mm².',
    detail: 'Penggunaan kabel di bawah 1,5 mm² untuk sirkit cabang tenaga/penerangan dilarang untuk menjamin kekuatan mekanik dan menghindari panas berlebih akibat korsleting sebelum pengaman MCB trip.'
  },
  {
    id: 'susut-tegangan',
    title: 'Batas Maksimum Susut Tegangan (Voltage Drop)',
    category: 'Kualitas Daya',
    pasal: 'PUIL 2011/2020 Bagian 525 (Lampiran G)',
    summary: 'Maksimal susut tegangan antara titik awal instalasi (APP PLN) hingga titik beban terjauh adalah 4% untuk instalasi penerangan dan 5% untuk beban lainnya.',
    detail: 'Susut tegangan berlebih mengakibatkan lampu redup, motor listrik overheat, efisiensi peralatan turun drastis, dan pemborosan energi pada penghantar kabel.'
  },
  {
    id: 'tahanan-pembumian',
    title: 'Nilai Tahanan Pembumian (Grounding) yang Disyaratkan',
    category: 'Pembumian (Earthing)',
    pasal: 'PUIL 2011/2020 Bagian 542 & SNI 0225:2020',
    summary: 'Tahanan pentanahan elektroda bumi untuk instalasi umum tidak boleh melebihi 5 Ohm (disarankan < 2 Ohm untuk sistem proteksi petir dan perangkat elektronik sensitif).',
    detail: 'Jika satu batang elektroda pasak belum mencapai < 5 Ohm karena tingginya resistivitas tanah, wajib ditambah elektroda paralel dengan jarak antar pasak minimal sama dengan panjang batang (biasanya minimal 3 meter).'
  },
  {
    id: 'rcd-gpas-wajib',
    title: 'Kewajiban Penggunaan RCD / GPAS (Sensitivitas 30mA)',
    category: 'Proteksi Manusia',
    pasal: 'PUIL 2011/2020 Bagian 411.3.3 & 531.2',
    summary: 'Gawai Proteksi Arus Sisa (GPAS/RCD/ELCB) dengan arus operasi sisa pengenal (IΔn) ≤ 30 mA WAJIB dipasang pada semua sirkit kotak kontak (stop kontak) arus pengenal ≤ 32 A.',
    detail: 'MCB biasa HANYA memutus arus lebih dan hubung singkat, TIDAK DAPAT melindungi manusia dari sengatan listrik mematikan (arus sentuh > 50mA bisa menghentikan jantung). RCD 30mA akan trip dalam waktu < 40 milidetik saat terjadi kebocoran arus ke tubuh manusia.'
  },
  {
    id: 'tinggi-saklar-stopkontak',
    title: 'Ketinggian Standar Pemasangan Sakelar dan Kotak Kontak',
    category: 'Pemasangan Fisik',
    pasal: 'PUIL 2011/2020 Bagian 510.4 & Aturan Praktis SNI',
    summary: 'Sakelar dipasang 120 cm - 150 cm di atas lantai selesai. Kotak kontak dipasang 120 cm - 150 cm, atau jika di bawah 120 cm WAJIB menggunakan tipe bertutup proteksi (shutter) agar aman dari jangkauan anak.',
    detail: 'Saklar juga harus dipasang di sisi pintu yang mudah dijangkau saat pintu dibuka (tidak terhalang daun pintu), dan dilarang dipasang di tempat yang terkena air tanpa housing proteksi cuaca.'
  },
  {
    id: 'tahanan-isolasi-minimum',
    title: 'Uji Tahanan Isolasi Minimum Instalasi Listrik Baru',
    category: 'Inspeksi & Uji Laik',
    pasal: 'PUIL 2011/2020 Bagian 61.3.3 (Tabel 61)',
    summary: 'Nilai tahanan isolasi antara konduktor aktif dengan bumi (PE) pada tegangan pengenal hingga 500V minimal adalah 1,0 MΩ (Megohm) dengan tegangan uji 500V DC (Megger).',
    detail: 'Sebelum dialiri tegangan PLN, instalasi wajib diuji megger. Tahanan isolasi < 0,5 MΩ berpotensi menimbulkan arus bocor, risiko kebakaran akibat percikan api listrik (arc fault), atau sering membuat ELCB trip tanpa sebab jelas.'
  },
  {
    id: 'pipa-pelindung-konduit',
    title: 'Pemasangan Kabel dalam Pipa Konduit Pelindung',
    category: 'Kabel & KHA',
    pasal: 'PUIL 2011/2020 Bagian 522.6 & 522.8',
    summary: 'Kabel NYA wajib dipasang di dalam pipa pelindung (PVC high-impact atau pipa besi). Pengisian kabel dalam pipa tidak boleh melebihi 40% dari luas penampang dalam pipa.',
    detail: 'Batas 40% pengisian pipa diperlukan agar sirkulasi udara pelepas panas kabel tetap terjaga dan penarikan/penggantian kabel tidak macet serta tidak merusak isolasi.'
  },
  {
    id: 'kurva-karakteristik-mcb',
    title: 'Pemilihan Kurva Trip MCB (Tipe B, C, dan D)',
    category: 'Proteksi MCB',
    pasal: 'PUIL 2011/2020 Bagian 431 & SNI IEC 60898',
    summary: 'Kurva B: Trip 3-5 x In (penerangan & pemanas resistif murni). Kurva C: Trip 5-10 x In (beban umum rumah tinggal, stop kontak, AC, kulkas). Kurva D: Trip 10-20 x In (motor industri besar, transformator, las listrik).',
    detail: 'Paling umum di rumah tinggal adalah MCB tipe C karena mampu menahan arus kejut sesaat (inrush current) kompresor AC atau pompa air tanpa trip palsu.'
  }
];

// Daftar Periksa (Checklist) Kepatuhan Instalasi PUIL
export const INSPECTION_CHECKLIST = [
  {
    category: 'Panel Hubung Bagi (PHB / Kotak Sekring)',
    items: [
      { id: 'phb_1', label: 'Terdapat MCB Utama dengan kapasitas sesuai kontrak daya PLN.', critical: true },
      { id: 'phb_2', label: 'Terdapat pemutus arus sisa (RCD/ELCB/GPAS 30mA) untuk proteksi sirkit stop kontak.', critical: true },
      { id: 'phb_3', label: 'Beban terbagi rapi ke beberapa grup/sirkit cabang (penerangan terpisah dari stop kontak daya).', critical: false },
      { id: 'phb_4', label: 'Tersedia terminal pembumian (Grounding Bar) dan terminal Netral yang terpisah (tidak dikopel di panel pelanggan).', critical: true },
      { id: 'phb_5', label: 'Setiap MCB cabang diberi label/penamaan ruangan atau beban dengan jelas.', critical: false },
    ]
  },
  {
    category: 'Penghantar & Kabel Sirkit Cabang',
    items: [
      { id: 'cable_1', label: 'Ukuran kabel sirkit penerangan minimal 1,5 mm² tembaga berisolasi ganda (NYM) atau pipa.', critical: true },
      { id: 'cable_2', label: 'Ukuran kabel sirkit stop kontak minimal 2,5 mm² tembaga.', critical: true },
      { id: 'cable_3', label: 'Warna isolasi kabel sesuai SNI PUIL (Fasa: Cokelat/Hitam/Abu-abu, Netral: Biru, Ground: Kuning-Hijau).', critical: false },
      { id: 'cable_4', label: 'Semua sambungan kabel berada di dalam kotak sambung (Junction Box / Doos) dan ditutup lasdop aman.', critical: true },
      { id: 'cable_5', label: 'Kabel yang tertanam dalam plesteran atau di atas plafon terlindung pipa konduit pelindung.', critical: false },
    ]
  },
  {
    category: 'Kotak Kontak & Sakelar',
    items: [
      { id: 'outlet_1', label: 'Semua stop kontak dilengkapi kutub grounding (arde) yang tersambung efektif ke tanah.', critical: true },
      { id: 'outlet_2', label: 'Stop kontak di tempat basah/luar ruangan menggunakan penutup kedap air (minimal IP44/IP55).', critical: true },
      { id: 'outlet_3', label: 'Sakelar lampu memutus penghantar FASA (bukan netral), sehingga fitting lampu mati total saat sakelar OFF.', critical: true },
      { id: 'outlet_4', label: 'Ketinggian pemasangan sakelar 1,2 - 1,5 meter dari lantai dan tidak terhalang pintu.', critical: false },
    ]
  },
  {
    category: 'Sistem Pembumian (Grounding)',
    items: [
      { id: 'ground_1', label: 'Batang elektroda grounding terpasang sempurna masuk ke dalam tanah lembab.', critical: true },
      { id: 'ground_2', label: 'Nilai tahanan pembumian terukur ≤ 5 Ohm (diuji dengan Earth Tester).', critical: true },
      { id: 'ground_3', label: 'Kabel penghantar pembumian dari elektroda ke PHB minimal 6 mm² tembaga tanpa sambungan rapuh.', critical: true },
      { id: 'ground_4', label: 'Bodi logam peralatan berdaya besar (water heater, oven, AC outdoor) terhubung ke arde.', critical: true },
    ]
  }
];

// Data Sistem Pembumian Distribusi Tenaga Listrik (PUIL 2011 Bagian 312.2 / IEC 60364)
export const EARTHING_SYSTEMS = [
  {
    id: 'TT',
    name: 'Sistem TT',
    fullName: 'Terra - Terra (Pembumian Sumber dan Konsumen Mandiri Terpisah)',
    codeMeaning: {
      first: 'T (Terre): Titik netral trafo sumber dibumikan langsung ke tanah.',
      second: 'T (Terre): Bagian Konduktif Terbuka (BKT) / bodi peralatan konsumen dibumikan ke elektroda lokal mandiri.'
    },
    isIndonesiaPlnStandard: true,
    badgeText: 'Standar Resmi PLN Rumah Tinggal',
    summary: 'Sistem resmi di Indonesia untuk instalasi rumah tinggal dan pelanggan tegangan rendah PLN. Titik netral trafo PLN dibumikan di gardu, sedangkan instalasi rumah memiliki elektroda tanah (ground rod) sendiri tanpa tersambung ke kawat netral PLN.',
    conductors: '1-Fasa: 3 kawat (L, N, PE) atau 3-Fasa: 4/5 kawat (L1, L2, L3, N, PE lokal)',
    protectionRequired: 'WAJIB pasang GPAS / RCD / ELCB (≤ 30 mA). Karena tahanan tanah elektroda lokal (Ra) membatasi arus hubung singkat tanah sehingga MCB seringkali tidak cukup cepat memutus arus gangguan.',
    advantages: [
      'Sangat sederhana bagi penyedia listrik (PLN tidak perlu menarik kabel proteksi PE ke pelanggan).',
      'Tidak ada risiko bahaya tegangan sentuh akibat kawat PEN putus dari jaringan luar.',
      'Sangat efektif mengisolasi gangguan antar pelanggan yang berdampingan.'
    ],
    disadvantages: [
      'Nilai tahanan tanah lokal (Ra) harus dijaga ketat (PUIL: ≤ 5 Ohm).',
      'MCB tidak dapat diandalkan sebagai proteksi sengatan arus bocor tanah; WAJIB menggunakan RCD/GPAS.'
    ],
    applications: 'Instalasi pelanggan tegangan rendah PLN (rumah tinggal, ruko, kantor kecil di seluruh Indonesia).'
  },
  {
    id: 'TN-S',
    name: 'Sistem TN-S',
    fullName: 'Terra Neutral - Separated (Netral & Proteksi Dipisah Total)',
    codeMeaning: {
      first: 'T (Terre): Titik netral sumber dibumikan langsung ke tanah.',
      second: 'N (Neutre): Bodi peralatan dihubungkan langsung ke titik netral sistem penyedia melalui kawat PE.',
      third: 'S (Séparé): Kawat Netral (N) dan Kawat Proteksi (PE) dipisah secara permanen di seluruh jaringan.'
    },
    isIndonesiaPlnStandard: false,
    badgeText: 'Paling Bersih (Bebas Noise & EMC)',
    summary: 'Kawat Netral (N) dan Kawat Proteksi Ground (PE) terpisah 100% dari gardu trafo sampai ke titik beban konsumen. Arus beban balik hanya mengalir di kawat N, sedangkan kawat PE selalu berarus nol pada kondisi normal.',
    conductors: '1-Fasa: 3 kawat (L, N, PE) | 3-Fasa: 5 kawat (L1, L2, L3, N, PE)',
    protectionRequired: 'MCB / Sekring dan RCD / GPAS dapat bekerja sangat presisi dan cepat karena arus gangguan tanah memiliki impedansi loop yang sangat rendah (arus gangguan tinggi).',
    advantages: [
      'Paling aman terhadap interferensi elektromagnetik (EMC), ideal untuk perangkat sensitif audio, telekomunikasi, dan server data center.',
      'RCD/GPAS dapat dipasang di seluruh titik tanpa kendala arus sisa palsu.',
      'Bodi peralatan berada pada potensial netral sumber yang stabil.'
    ],
    disadvantages: [
      'Biaya kabel paling tinggi karena membutuhkan kabel berinti 5 (penghantar terpisah sepanjang instalasi).'
    ],
    applications: 'Pusat data (Data Center), rumah sakit modern, studio audio/broadcasting, gedung perkantoran kelas tinggi dengan trafo privat.'
  },
  {
    id: 'TN-C-S',
    name: 'Sistem TN-C-S',
    fullName: 'Terra Neutral - Combined lalu Separated (PME / Protective Multiple Earthing)',
    codeMeaning: {
      first: 'T (Terre): Titik netral trafo dibumikan langsung.',
      second: 'N (Neutre): Bodi peralatan terhubung ke netral.',
      third: 'C-S: Dari trafo ke batas bangunan menggunakan kawat gabungan (PEN), lalu di PDB bangunan dipecah menjadi PE dan N terpisah.'
    },
    isIndonesiaPlnStandard: false,
    badgeText: 'Populer di Luar Negeri (PME)',
    summary: 'Di jaringan distribusi PLN/penyedia luar memakai 4 kawat dengan penghantar gabungan PEN (TN-C). Begitu masuk ke Panel Distribusi Utama (PDB) gedung konsumen, kawat PEN dibumikan ulang ke elektroda tanah lalu dipecah permanen menjadi kawat Netral (N) dan kawat Ground (PE). Setelah dipisah, N dan PE DILARANG keras disambung kembali.',
    conductors: 'Sisi Distribusi: PEN (4 kawat) | Sisi Dalam Gedung: N + PE (5 kawat)',
    protectionRequired: 'MCB / Sekring untuk proteksi arus lebih, RCD/GPAS HANYA boleh dipasang di sisi instalasi dalam setelah titik pemisahan N dan PE.',
    advantages: [
      'Hemat biaya pada jaringan kabel distribusi luar, namun tetap memberikan keamanan TN-S di dalam gedung.',
      'Arus gangguan tanah tinggi sehingga MCB dapat trip cepat.'
    ],
    disadvantages: [
      'Jika kabel PEN distribusi di luar putus, bodi logam seluruh peralatan di dalam gedung bisa bertegangan fasa berbahaya.',
      'Memerlukan elektroda pembumian ulang (multiple earthing) yang sangat andal di panel utama.'
    ],
    applications: 'Gedung komersial, pabrik industri, perumahan di negara-negara Eropa/Inggris/Australia (sistem PME).'
  },
  {
    id: 'TN-C',
    name: 'Sistem TN-C',
    fullName: 'Terra Neutral - Combined (Netral & Proteksi Digabung dalam Kawat PEN)',
    codeMeaning: {
      first: 'T (Terre): Titik netral sumber dibumikan langsung.',
      second: 'N (Neutre): Bodi peralatan dihubungkan ke titik pembumian sistem melalui konduktor PEN.',
      third: 'C (Combiné): Fungsi kawat Netral dan Proteksi disatukan menjadi satu kawat tunggal (PEN).'
    },
    isIndonesiaPlnStandard: false,
    badgeText: 'Khusus Saluran Utama (Bukan Sirkit Akhir)',
    summary: 'Kawat Netral dan Proteksi digabung menjadi satu kabel yaitu PEN (Protective Earth and Neutral) di seluruh sistem. Hanya menggunakan 4 kawat untuk 3 fasa.',
    conductors: '3-Fasa: 4 kawat (L1, L2, L3, PEN). Tidak ada kabel PE terpisah.',
    protectionRequired: 'DILARANG KERAS MEMASANG RCD / GPAS pada konduktor PEN! Karena jika RCD memutus kawat PEN, seluruh bodi peralatan akan mengapung ke tegangan fasa dan menyengat fatal siapa pun yang menyentuhnya. Penampang kawat PEN wajib minimal 10 mm² tembaga atau 16 mm² aluminium (PUIL Bagian 543.4).',
    advantages: [
      'Biaya paling murah (menghemat 1 jalur konduktor kabel pada jaringan tegangan rendah).'
    ],
    disadvantages: [
      'Dilarang untuk sirkit akhir konsumen dan beban satu fasa kecil.',
      'Resiko kebakaran dan sengatan maut jika kabel PEN putus/kendur.',
      'Tingkat gangguan elektromagnetik (EMC noise) tinggi karena arus netral mengalir di jalur proteksi bodi.'
    ],
    applications: 'Jaringan transmisi/distribusi utama hulu, feeder antar gardu listrik (tidak boleh digunakan pada sirkit stop kontak rumah tinggal).'
  },
  {
    id: 'IT',
    name: 'Sistem IT',
    fullName: 'Impedance / Isolated - Terra (Titik Netral Mengambang / Melalui Impedansi)',
    codeMeaning: {
      first: 'I (Isolé): Titik netral trafo tidak dibumikan langsung (diisolasi atau dihubungkan lewat impedansi tinggi 1000 - 2000 Ohm).',
      second: 'T (Terre): Bagian Konduktif Terbuka (BKT) / bodi beban dibumikan secara mandiri ke tanah.'
    },
    isIndonesiaPlnStandard: false,
    badgeText: 'Vital (Ruang Operasi RS / Fasilitas Tanpa Padam)',
    summary: 'Sistem khusus di mana suplai trafo tidak dibumikan langsung. Saat terjadi gangguan fasa ke bodi/tanah pertama, arus bocor yang mengalir SANGAT KECIL (hanya beberapa miliamper) sehingga sistem TIDAK AKAN TRIP / PADAM, dan peralatan vital tetap menyala normal.',
    conductors: '3-Fasa 3-kawat atau 4-kawat dengan isolasi termonitor.',
    protectionRequired: 'WAJIB dilengkapi Insulation Monitoring Device (IMD / Perangkat Pemantau Isolasi) yang membunyikan alarm suara/lampu saat terjadi kegagalan isolasi pertama, agar teknisi segera memperbaiki sebelum terjadi gangguan fasa kedua.',
    advantages: [
      'Kontinuitas suplai listrik tertinggi (tidak terjadi pemadaman mendadak saat gangguan tanah pertama).',
      'Arus gangguan pertama sangat kecil sehingga tidak menimbulkan percikan api atau sengatan listrik berbahaya.'
    ],
    disadvantages: [
      'Biaya pemasangan dan peralatan pemantau isolasi (IMD) sangat mahal.',
      'Memerlukan teknisi ahli berlisensi untuk pemeliharaan rutin segera setelah alarm IMD berbunyi.'
    ],
    applications: 'Ruang Operasi Rumah Sakit (Instalasi Kamar Bedah / ICU - PUIL Bagian 710), tambang bawah tanah rawan ledakan gas, kapal laut, ruang kontrol reaktor kimia.'
  }
];

