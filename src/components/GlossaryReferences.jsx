import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Award, 
  ExternalLink, 
  Copy, 
  Check, 
  RotateCcw,
  Layers,
  HelpCircle,
  Hash,
  Scale
} from 'lucide-react';

export default function GlossaryReferences() {
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'glossary', 'acronym', 'standards'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 1. Data Glosarium Istilah PUIL
  const glossaryList = [
    {
      id: 'g-bkt',
      term: 'BKT (Bagian Konduktif Terbuka)',
      termEn: 'Exposed Conductive Part',
      category: 'Pembumian & Proteksi',
      puilRef: 'PUIL 2020 Bagian 2 (2.1.2)',
      definition: 'Bagian konduktif perlengkapan listrik yang dapat disentuh manusia dan biasanya tidak bertegangan, namun dapat menjadi bertegangan jika terjadi kegagalan insulasi dasar.',
      example: 'Contoh: Casing logam motor listrik, bodi kulkas, rangka panel PHB logam, pipa konduit logam.',
      rule: 'PUIL mewajibkan seluruh BKT dihubungkan ke Penghantar Proteksi (PE) untuk menjamin pemutusan otomatis pasokan saat terjadi gangguan fasa ke bodi.'
    },
    {
      id: 'g-bpu',
      term: 'BPU (Bagian Konduktif Ekstra)',
      termEn: 'Extraneous Conductive Part',
      category: 'Pembumian & Proteksi',
      puilRef: 'PUIL 2020 Bagian 2 (2.1.3) & 411.3.1.2',
      definition: 'Bagian konduktif yang bukan merupakan bagian dari instalasi listrik tetapi berpotensi mengintroduksikan potensial listrik (terutama potensial bumi).',
      example: 'Contoh: Pipa saluran air logam, struktur rangka baja gedung, pipa gas, rel lift.',
      rule: 'Wajib dihubungkan ke Terminal Pembumian Utama (MET) melalui Ikatan Ekuipotensial Utama (Main Equipotential Bonding) untuk menghilangkan perbedaan tegangan sentuh.'
    },
    {
      id: 'g-kha',
      term: 'KHA (Kuat Hantar Arus)',
      termEn: 'Current-Carrying Capacity (Iz)',
      category: 'Kabel & KHA',
      puilRef: 'PUIL 2020 Tabel 52-C1 s.d 52-C12',
      definition: 'Arus listrik kontinu maksimum yang dapat dialirkan oleh penghantar dalam kondisi tertentu tanpa menyebabkan suhu insulasi kabel melebihi batas pengenal yang diizinkan (misal PVC maks 70°C, XLPE maks 90°C).',
      example: 'Rumus Kaidah Dasar PUIL: Ib ≤ In ≤ Iz (Arus Beban Desain ≤ Arus Pengenal MCB ≤ KHA Kabel).',
      rule: 'KHA dihitung berdasarkan jenis konduktor (Cu/Al), insulasi, cara pemasangan (dalam pipa, di udara, dalam tanah), dan dikalikan faktor koreksi suhu serta grouping kabel.'
    },
    {
      id: 'g-gpas',
      term: 'GPAS / RCD (Gawai Proteksi Arus Sisa)',
      termEn: 'Residual Current Device (RCD)',
      category: 'Alat Proteksi',
      puilRef: 'PUIL 2020 Subklausul 411.3.3 & 531.2',
      definition: 'Gawai sakelar mekanis yang dirancang untuk membuka kontak sirkit secara otomatis apabila arus sisa (arus bocor ke tanah) mencapai nilai kepekaan nominal IΔn tertentu.',
      example: 'Kepekaan 30 mA untuk proteksi sentuh langsung manusia (stop kontak & kamar mandi), 300 mA / 500 mA untuk proteksi bahaya kebakaran akibat arus bocor.',
      rule: 'Wajib dipasang pada seluruh stop kontak rumah tinggal (Kolektif atau per-grup) pada sistem pembumian TT sesuai standar PLN dan PUIL.'
    },
    {
      id: 'g-susut-tegangan',
      term: 'Susut Tegangan (Drop Voltage / ΔV)',
      termEn: 'Voltage Drop',
      category: 'Kabel & KHA',
      puilRef: 'PUIL 2020 Klausul 525 & Tabel 52-F',
      definition: 'Selisih antara tegangan listrik pada terminal pengirim (sumber / kWh meter) dengan tegangan pada terminal penerima (beban pemanfaat) akibat tahanan dan reaktansi kabel.',
      example: 'Batas maksimum PUIL: ≤ 4% untuk instalasi penerangan & stop kontak umum; ≤ 5% dari sumber kWh meter sampai beban terjauh (atau maks 10% saat pengasutan motor).',
      rule: 'Jika panjang kabel melebihi jarak kritis, penampang penghantar harus diperbesar satu tingkat meskipun KHA termalnya sudah mencukupi.'
    },
    {
      id: 'g-tegangan-sentuh',
      term: 'Tegangan Sentuh (Touch Voltage / Ut)',
      termEn: 'Touch Voltage',
      category: 'Pembumian & Proteksi',
      puilRef: 'PUIL 2020 Bagian 4-41',
      definition: 'Tegangan listrik yang terjadi antara bagian konduktif yang disentuh manusia secara serentak (misal bodi mesin) dengan titik acuan bumi ketika terjadi kegagalan insulasi.',
      example: 'Batas tegangan sentuh aman: Maksimum 50 V AC pada ruangan kering normal, dan maksimum 25 V AC pada lingkungan basah / lembab / kamar mandi.',
      rule: 'Pemutusan otomatis pasokan (ADS) harus bekerja dalam waktu ≤ 0.4 detik pada sistem 230V TN, atau ≤ 0.2 detik pada sistem TT.'
    },
    {
      id: 'g-ekuipotensial',
      term: 'Ikatan Ekuipotensial (Equipotential Bonding)',
      termEn: 'Equipotential Bonding',
      category: 'Pembumian & Proteksi',
      puilRef: 'PUIL 2020 Subklausul 411.3.1.2 & 544',
      definition: 'Penyambungan listrik yang menghubungkan secara andal bagian-bagian konduktif terbuka (BKT) dan bagian konduktif ekstra (BPU) agar memiliki potensial listrik yang substansial sama.',
      example: 'Penyambungan pipa air besi, tulangan beton, dan rel proteksi ke Busbar Pembumian Utama (MET).',
      rule: 'Mencegah timbulnya perbedaan potensial berbahaya antara dua permukaan logam yang dapat disentuh manusia secara bersamaan saat terjadi sambaran petir atau gangguan fasa tanah.'
    },
    {
      id: 'g-tahanan-pembumian',
      term: 'Tahanan Pembumian (Earthing Resistance / Ra)',
      termEn: 'Earth Electrode Resistance',
      category: 'Pembumian & Proteksi',
      puilRef: 'PUIL 2020 Klausul 542 & Permen ESDM',
      definition: 'Resistansi total antara elektroda pembumian (ground rod, pelat, atau pita tembaga) yang tertanam di dalam tanah terhadap bumi acuan massa netral.',
      example: 'Standar baku PUIL & PLN: Nilai Ra sebaiknya ≤ 5 Ohm untuk instalasi bangunan umum, dan ≤ 1 Ohm untuk instalasi trafo gardu / penangkal petir khusus.',
      rule: 'Jika elektroda tunggal belum mencapai nilai ≤ 5 Ohm, dapat ditambahkan panjang batang pasak, penanaman paralel multipel elektroda, atau penggantian media tanah (bentonit).'
    },
    {
      id: 'g-sirkit-akhir',
      term: 'Sirkit Akhir (Final Circuit)',
      termEn: 'Final Branch Circuit',
      category: 'Motor & Sirkit',
      puilRef: 'PUIL 2020 Bagian 5-51 & 510',
      definition: 'Sirkit kabel yang terhubung langsung dari rel pembagi PHB / MCB cabang menuju ke perlengkapan pemanfaat tenaga listrik (lampu, stop kontak, motor listrik tunggal).',
      example: 'KHA sirkit akhir motor listrik wajib sekurang-kurangnya 125% dari arus beban penuh motor (1.25 × In).',
      rule: 'Sirkit akhir harus diproteksi secara mandiri terhadap beban lebih dan hubung pendek oleh pemutus sirkit cabang.'
    },
    {
      id: 'g-sirkit-pengisi',
      term: 'Sirkit Pengisi / Saluran Utama (Feeder)',
      termEn: 'Distribution Feeder Circuit',
      category: 'Motor & Sirkit',
      puilRef: 'PUIL 2011 Pasal 510.5.4 / PUIL 2020 Pasal 5100.5',
      definition: 'Penghantar listrik antara panel hubung bagi utama (MDP) ke panel-panel distribusi cabang (SDP/Sub-Panel) atau saluran yang mensuplai kelompok beberapa motor listrik.',
      example: 'Rumus KHA Feeder Motor PUIL: KHA = (125% × In Motor Terbesar) + Total In Motor-Motor Lainnya.',
      rule: 'Proteksi sirkit pengisi ditentukan berdasarkan rating proteksi motor terbesar ditambah total arus beban motor lainnya.'
    },
    {
      id: 'g-selektivitas',
      term: 'Selektivitas Proteksi (Diskriminasi)',
      termEn: 'Protection Selectivity / Discrimination',
      category: 'Alat Proteksi',
      puilRef: 'PUIL 2020 Klausul 536',
      definition: 'Koordinasi karakteristik operasi antara gawai-gawai proteksi yang dipasang seri (hulu dan hilir) sehingga bila terjadi gangguan, hanya gawai terdekat di sisi beban yang trip.',
      example: 'Contoh: Jika terjadi konsleting pada stop kontak kamar, hanya MCB 6A grup kamar yang trip, sedangkan MCB utama 25A di kWh meter PLN tetap ON.',
      rule: 'Dicapai melalui perbandingan rating arus nominal (rasio rasional minimal 1:1.6 untuk MCB/Sekring) dan pengaturan kurva waktu pemutusan.'
    },
    {
      id: 'g-tahanan-jenis-tanah',
      term: 'Tahanan Jenis Tanah (Soil Resistivity / ρ)',
      termEn: 'Soil Resistivity',
      category: 'Pembumian & Proteksi',
      puilRef: 'PUIL 2020 Tabel 54-B1',
      definition: 'Resistivitas bahan tanah yang dinyatakan dalam satuan Ohm-meter (Ω·m), mencerminkan kemampuan tanah dalam menghantarkan arus listrik pembumian.',
      example: 'Tanah rawa/lumpur: 10 - 30 Ω·m; Tanah liat sawah: 20 - 100 Ω·m; Pasir basah: 200 Ω·m; Pasir kering / berbatu: 1000 - 3000 Ω·m.',
      rule: 'Menentukan kedalaman dan jumlah elektroda pasak pembumian yang dibutuhkan untuk mencapai target tahanan pembumian Ra ≤ 5 Ohm.'
    },
    {
      id: 'g-kapasitas-pemutusan',
      term: 'Kapasitas Pemutusan (Breaking Capacity / Icu atau Icn)',
      termEn: 'Short-Circuit Breaking Capacity',
      category: 'Alat Proteksi',
      puilRef: 'PUIL 2020 Klausul 434 & 533',
      definition: 'Nilai arus hubung pendek prospektif tertinggi (dalam kA) yang mampu diputuskan oleh pemutus sirkit (MCB/MCCB) dengan aman tanpa hancur atau timbul busur api membahayakan.',
      example: 'MCB standar rumah umumnya bertuliskan kode kotak 4500 (4.5 kA) atau 6000 (6 kA). Panel industri memakai 10 kA s.d 50 kA.',
      rule: 'Kapasitas pemutusan gawai proteksi harus lebih besar atau sama dengan arus hubung pendek prospektif tertinggi di titik instalasi tersebut.'
    }
  ];

  // 2. Data Akronim & Singkatan Kelistrikan
  const acronymList = [
    {
      abbr: 'PUIL',
      fullNameId: 'Pedoman Umum Instalasi Listrik',
      fullNameEn: 'General Rules for Electrical Installations',
      category: 'Regulasi & Standar',
      function: 'Standar acuan teknis konsensus nasional tertinggi untuk perancangan, pemasangan, dan verifikasi instalasi listrik tegangan rendah di Indonesia.',
      standard: 'SNI 0225:2020 (Adopsi IEC 60364)'
    },
    {
      abbr: 'SNI',
      fullNameId: 'Standar Nasional Indonesia',
      fullNameEn: 'Indonesian National Standard',
      category: 'Regulasi & Standar',
      function: 'Dokumen standar teknis tunggal yang berlaku secara nasional di Indonesia, dirumuskan oleh BSN (Badan Standardisasi Nasional).',
      standard: 'BSN / UU No. 20/2014'
    },
    {
      abbr: 'SPLN',
      fullNameId: 'Standar Perusahaan Listrik Negara',
      fullNameEn: 'PLN Corporation Standard',
      category: 'Regulasi & Standar',
      function: 'Spesifikasi teknis, pedoman konstruksi, dan standarisasi peralatan yang diterbitkan oleh PT PLN (Persero) untuk jaringan ketenagalistrikan.',
      standard: 'PT PLN (Persero) Puslitbang'
    },
    {
      abbr: 'KHA',
      fullNameId: 'Kuat Hantar Arus',
      fullNameEn: 'Current Carrying Capacity (Iz)',
      category: 'Parameter Teknis',
      function: 'Besaran arus kontinu maksimum (Ampere) yang aman dialirkan oleh kawat penghantar kabel tanpa merusak isolator.',
      standard: 'PUIL 2020 Tabel 52-C1'
    },
    {
      abbr: 'MCB',
      fullNameId: 'Pemutus Sirkit Miniatur',
      fullNameEn: 'Miniature Circuit Breaker',
      category: 'Alat Proteksi',
      function: 'Gawai proteksi elektromekanis untuk melindungi kabel dan beban dari arus lebih akibat beban lebih (bimetal thermal) dan hubung pendek (kumparan magnetik) hingga 125 A.',
      standard: 'IEC 60898-1 / SNI 04-6507.1'
    },
    {
      abbr: 'MCCB',
      fullNameId: 'Pemutus Sirkit Kotak Cetak',
      fullNameEn: 'Molded Case Circuit Breaker',
      category: 'Alat Proteksi',
      function: 'Pemutus sirkit berkapasitas daya menengah hingga tinggi (16 A s.d 1600 A) dengan kapasitas pemutusan hubung pendek tinggi (hingga 100 kA) untuk panel distribusi utama.',
      standard: 'IEC 60947-2'
    },
    {
      abbr: 'ACB',
      fullNameId: 'Pemutus Sirkit Udara',
      fullNameEn: 'Air Circuit Breaker',
      category: 'Alat Proteksi',
      function: 'Pemutus sirkit utama tegangan rendah berarus sangat besar (630 A s.d 6300 A) yang menggunakan udara bertekanan atmosfer sebagai media pemadam busur api listrik.',
      standard: 'IEC 60947-2'
    },
    {
      abbr: 'RCD',
      fullNameId: 'Gawai Arus Sisa',
      fullNameEn: 'Residual Current Device',
      category: 'Alat Proteksi',
      function: 'Alat proteksi terhadap sengatan listrik dan kebakaran yang mendeteksi ketidakseimbangan arus antara penghantar fasa dan netral (arus bocor ke tanah).',
      standard: 'IEC 61008-1 / PUIL 531'
    },
    {
      abbr: 'GPAS',
      fullNameId: 'Gawai Proteksi Arus Sisa',
      fullNameEn: 'Residual Current Protective Device',
      category: 'Alat Proteksi',
      function: 'Istilah baku dalam bahasa Indonesia resmi PUIL 2020 untuk RCD / ELCB.',
      standard: 'PUIL 2020 Subklausul 411.3.3'
    },
    {
      abbr: 'RCBO',
      fullNameId: 'Pemutus Arus Sisa dengan Proteksi Arus Lebih',
      fullNameEn: 'Residual Current Breaker with Overcurrent Protection',
      category: 'Alat Proteksi',
      function: 'Perangkat terpadu gabungan fungsi MCB + RCD dalam satu fisik modul tunggal: melindungi beban lebih, hubung pendek, sekaligus arus bocor ke tanah.',
      standard: 'IEC 61009-1'
    },
    {
      abbr: 'RCCB',
      fullNameId: 'Pemutus Sirkit Arus Sisa Murni',
      fullNameEn: 'Residual Current Circuit Breaker',
      category: 'Alat Proteksi',
      function: 'RCD murni yang hanya bereaksi terhadap arus bocor ke tanah. Tidak memproteksi beban lebih atau konslet, sehingga WAJIB dipasang seri di belakang MCB.',
      standard: 'IEC 61008-1'
    },
    {
      abbr: 'ELCB',
      fullNameId: 'Pemutus Kebocoran Bumi',
      fullNameEn: 'Earth Leakage Circuit Breaker',
      category: 'Alat Proteksi',
      function: 'Istilah teknis generasi terdahulu untuk pemutus arus bocor tanah. Versi modern berbasis arus dinamakan RCD/RCCB.',
      standard: 'IEC Classic Standard'
    },
    {
      abbr: 'TOR',
      fullNameId: 'Relai Beban Lebih Termal',
      fullNameEn: 'Thermal Overload Relay',
      category: 'Alat Proteksi',
      function: 'Relai proteksi berbasis elemen bimetal yang dipasang bersama kontaktor magnetis untuk melindungi kumparan motor listrik dari panas berlebih saat beban mekanik macet.',
      standard: 'IEC 60947-4-1'
    },
    {
      abbr: 'IMD',
      fullNameId: 'Gawai Pemantau Insulasi',
      fullNameEn: 'Insulation Monitoring Device',
      category: 'Alat Proteksi',
      function: 'Gawai yang terus-menerus memantau tingkat resistansi insulasi pada sistem pembumian IT (ruang operasi RS / tambang) dan membunyikan alarm saat timbul gangguan pertama.',
      standard: 'IEC 61557-8 / PUIL 411.6'
    },
    {
      abbr: 'SPD',
      fullNameId: 'Gawai Proteksi Surja',
      fullNameEn: 'Surge Protective Device',
      category: 'Alat Proteksi',
      function: 'Alat proteksi peralihan tegangan lebih (transient overvoltage) akibat sambaran petir atau switching jala-jala listrik untuk melindungi alat elektronik sensitif.',
      standard: 'IEC 61643-11 / PUIL 534'
    },
    {
      abbr: 'BKT',
      fullNameId: 'Bagian Konduktif Terbuka',
      fullNameEn: 'Exposed Conductive Part',
      category: 'Parameter Teknis',
      function: 'Bodi logam peralatan listrik yang normalnya tidak beraliran listrik, namun bisa tersengat jika isolasi kawat di dalamnya terkelupas.',
      standard: 'PUIL 2020 Bagian 2'
    },
    {
      abbr: 'BPU',
      fullNameId: 'Bagian Konduktif Ekstra',
      fullNameEn: 'Extraneous Conductive Part',
      category: 'Parameter Teknis',
      function: 'Struktur logam bukan bagian instalasi listrik (pipa ledeng, tiang baja gedung) yang dapat meneruskan potensial tanah.',
      standard: 'PUIL 2020 Klausul 411.3.1.2'
    },
    {
      abbr: 'PE',
      fullNameId: 'Penghantar Proteksi (Pentanahan)',
      fullNameEn: 'Protective Earth',
      category: 'Kabel & KHA',
      function: 'Kabel khusus keselamatan bergaris loreng hijau-kuning yang menghubungkan seluruh BKT ke elektroda pembumian.',
      standard: 'PUIL 2020 Klausul 543'
    },
    {
      abbr: 'PEN',
      fullNameId: 'Penghantar Proteksi dan Netral Gabungan',
      fullNameEn: 'Protective Earth and Neutral',
      category: 'Kabel & KHA',
      function: 'Kawat penghantar tunggal yang mengkombinasikan fungsi kawat Netral (N) dan kawat Proteksi (PE). Hanya diizinkan pada sistem TN-C dengan luas penampang min 10 mm² Cu.',
      standard: 'PUIL 2020 Klausul 543.4'
    },
    {
      abbr: 'PHB',
      fullNameId: 'Panel Hubung Bagi',
      fullNameEn: 'Switchgear & Controlgear Assembly (Panel)',
      category: 'Sistem & Distribusi',
      function: 'Susunan perlengkapan terpasang yang membagi tenaga listrik dari satu sumber ke beberapa sirkit cabang dilengkapi sakelar proteksi dan pengukuran.',
      standard: 'PUIL 2020 Bagian 5-51 & SNI IEC 61439'
    },
    {
      abbr: 'SLO',
      fullNameId: 'Sertifikat Laik Operasi',
      fullNameEn: 'Certificate of Operation Feasibility',
      category: 'Regulasi & Hukum',
      function: 'Sertifikat bukti keabsahan bahwa suatu instalasi listrik telah selesai diinspeksi, diuji, dan dinyatakan aman serta laik dialiri arus listrik PLN.',
      standard: 'UU Ketenagalistrikan No. 30/2009'
    },
    {
      abbr: 'NIDI',
      fullNameId: 'Nomor Identitas Instalasi Tenaga Listrik',
      fullNameEn: 'Electrical Installation Identity Number',
      category: 'Regulasi & Hukum',
      function: 'Nomor identitas unik resmi yang diterbitkan Ditjen Ketenagalistrikan (ESDM) kepada instalatur berizin sebelum proses pengajuan inspeksi SLO.',
      standard: 'Permen ESDM No. 11/2021'
    },
    {
      abbr: 'DOL',
      fullNameId: 'Sambungan Langsung Jala-Jala',
      fullNameEn: 'Direct On Line',
      category: 'Motor & Sirkit',
      function: 'Metode pengasutan motor listrik 3-fasa dengan menghubungkan terminal motor langsung ke tegangan jala-jala penuh (arus start mencapai 5 s.d 7 kali In).',
      standard: 'PUIL 2011 Bagian 510.5'
    },
    {
      abbr: 'VFD',
      fullNameId: 'Penggerak Frekuensi Variabel (Inverter)',
      fullNameEn: 'Variable Frequency Drive',
      category: 'Motor & Sirkit',
      function: 'Perangkat pengontrol motor AC dengan mengubah frekuensi dan tegangan suplai listrik, memungkinkan akselerasi halus tanpa lonjakan arus start tinggi.',
      standard: 'IEC 61800 Series'
    },
    {
      abbr: 'LIT',
      fullNameId: 'Lembaga Inspeksi Teknik',
      fullNameEn: 'Technical Inspection Body',
      category: 'Regulasi & Hukum',
      function: 'Badan usaha berakreditasi resmi Kementerian ESDM (seperti PPILN, Konsuil, Jaserindo) yang bertugas memeriksa instalasi dan menerbitkan SLO.',
      standard: 'Permen ESDM No. 11/2021'
    }
  ];

  // 3. Data Dokumen Standar & Regulasi Resmi
  const standardsList = [
    {
      code: 'SNI 0225:2020',
      title: 'Persyaratan Umum Instalasi Listrik 2020 (PUIL 2020)',
      issuedBy: 'Badan Standardisasi Nasional (BSN)',
      status: 'Standar Wajib Berlaku',
      badgeClass: 'win10-badge-success',
      year: '2020',
      summary: 'Revisi menyeluruh PUIL yang menyelaraskan seluruh klausul dengan seri standar internasional IEC 60364. Terdiri atas Bagian 1 sampai Bagian 9.',
      highlights: [
        'Adopsi resmi kode warna kabel baru IEC: Fasa L1 Hitam, L2 Cokelat, L3 Abu-abu, Netral Biru, PE Loreng Hijau-Kuning.',
        'Wajib proteksi tambahan GPAS/RCD 30 mA untuk seluruh stop kontak hunian & area basah.',
        'Penataan perhitungan Kuat Hantar Arus (KHA) kabel penampang penghantar Tabel 52-C1.',
        'Standarisasi batas susut tegangan maksimum 4% untuk instalasi penerangan dan stop kontak umum.'
      ]
    },
    {
      code: 'PUIL 2011 (SNI 0225:2011)',
      title: 'Persyaratan Umum Instalasi Listrik 2011 & Amandemen 1-6',
      issuedBy: 'Badan Standardisasi Nasional (BSN)',
      status: 'Transisi & Referensi Lapangan',
      badgeClass: 'win10-badge-accent',
      year: '2011',
      summary: 'Standar transisi penting yang memuat Gambar 510.5-2 (perhitungan sirkit motor listrik 3-fasa) dan amandemen proteksi sengatan arus listrik.',
      highlights: [
        'Memuat acuan baku Gambar 510.5-2: KHA Feeder 125% In motor terbesar + sum motor lainnya.',
        'Penetapan gawai proteksi hubung pendek sirkit motor (GPHP/Breaker) hingga 250% In untuk MCB/Invers.',
        'Ketentuan setelan Thermal Overload Relay (TOR) motor pada rentang 115% - 125% In.',
        'Klasifikasi 5 sistem pembumian: TT, TN-S, TN-C-S, TN-C, dan IT.'
      ]
    },
    {
      code: 'PUIL 2000 (SNI 04-0225-2000)',
      title: 'Persyaratan Umum Instalasi Listrik 2000',
      issuedBy: 'Badan Standardisasi Nasional (BSN)',
      status: 'Standar Historis / Lapangan Lama',
      badgeClass: 'win10-badge-warning',
      year: '2000',
      summary: 'Standar era 2000 yang banyak diterapkan pada gedung-gedung dan instalasi eksisting di Indonesia sebelum berlakunya PUIL 2020.',
      highlights: [
        'Menggunakan kode warna kabel klasik lama: L1 Merah, L2 Kuning, L3 Hitam, Netral Biru, PE Loreng.',
        'Kerap dijumpai pada instalasi bangunan lama yang belum direvitalisasi ke PUIL 2020.',
        'Acuan dasar pemahaman transisi warna kabel bagi teknisi saat melakukan retrofitting instalasi.'
      ]
    },
    {
      code: 'UU No. 30 Tahun 2009',
      title: 'Undang-Undang Republik Indonesia tentang Ketenagalistrikan',
      issuedBy: 'Pemerintah Republik Indonesia / DPR RI',
      status: 'Hukum Positif Wajib',
      badgeClass: 'win10-badge-danger',
      year: '2009',
      summary: 'Payung hukum tertinggi ketenagalistrikan nasional yang mewajibkan seluruh instalasi tenaga listrik memenuhi aspek Keselamatan Ketenagalistrikan (K2).',
      highlights: [
        'Pasal 44 ayat 4: Setiap instalasi tenaga listrik yang beroperasi WAJIB memiliki Sertifikat Laik Operasi (SLO).',
        'Menetapkan sanksi pidana dan denda bagi pengoperasian instalasi listrik tanpa SLO yang membahayakan jiwa.',
        'Mewajibkan tenaga teknik ketenagalistrikan memiliki Sertifikat Kompetensi Tenaga Teknik Listrik (SKTTK).'
      ]
    },
    {
      code: 'Permen ESDM No. 11 Tahun 2021',
      title: 'Pelaksanaan Ketentuan Keselamatan Ketenagalistrikan',
      issuedBy: 'Kementerian Energi dan Sumber Daya Mineral',
      status: 'Regulasi Pelaksana Wajib',
      badgeClass: 'win10-badge-success',
      year: '2021',
      summary: 'Regulasi operasional penerbitan Nomor Identitas Instalasi Listrik (NIDI) dan tata cara pengujian serta penerbitan Sertifikat Laik Operasi (SLO) oleh Lembaga Inspeksi Teknik (LIT).',
      highlights: [
        'Kewajiban pendaftaran NIDI sebelum pengajuan pemeriksaan SLO instalasi rumah maupun industri.',
        'Integrasi sistem informasi pelayanan ketenagalistrikan digital (Si Ujang Gatrik).',
        'Standarisasi checklist uji teknis tahanan isolasi, kontinuitas pembumian, dan fungsi trip GPAS/RCD.'
      ]
    },
    {
      code: 'SPLN D3.002-1: 2007',
      title: 'Spesifikasi Kabel Instalasi Rumah dan Pembumian TT Konsumen',
      issuedBy: 'PT PLN (Persero)',
      status: 'Standar BUMN PLN',
      badgeClass: 'win10-badge-accent',
      year: '2007',
      summary: 'Spesifikasi konstruksi dan material sambungan pelanggan tegangan rendah PLN, yang menegaskan bahwa sistem pembumian pelanggan PLN adalah TT.',
      highlights: [
        'PLN hanya menyuplai 2 kawat (Fasa + Netral) untuk 1-fasa atau 4 kawat (3 Fasa + Netral) untuk 3-fasa.',
        'Konsumen DIWAJIBKAN menanam batang elektroda pentanahan mandiri (PE) dengan target tahanan Ra ≤ 5 Ohm.',
        'Dilarang menghubungkan kawat Netral (N) dengan kawat Arde (PE) di panel instalasi konsumen (karena sistem TT).'
      ]
    },
    {
      code: 'IEC 60364 Series',
      title: 'Low-Voltage Electrical Installations (Parts 1 to 8)',
      issuedBy: 'International Electrotechnical Commission (IEC)',
      status: 'Standar Induk Internasional',
      badgeClass: 'win10-badge-accent',
      year: '2018-2023',
      summary: 'Standar referensi global instalasi listrik gedung yang diadopsi penuh oleh negara-negara Eropa dan diadopsi Indonesia menjadi SNI 0225:2020.',
      highlights: [
        'IEC 60364-4-41: Perlindungan terhadap kejutan listrik (Proteksi Otomatis Pemutusan Pasokan / ADS).',
        'IEC 60364-5-52: Pemilihan dan pemasangan sistem pengawatan kabel serta koreksi KHA.',
        'IEC 60364-5-54: Pengaturan elektroda pembumian dan penghantar proteksi ekuipotensial.',
        'IEC 60364-7: Ketentuan instalasi khusus (kamar mandi, kolam renang, ruang medis, EV charger).'
      ]
    }
  ];

  // Alphabet list for letter filter
  const alphabet = ['all', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  // Filtering Logic
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Glossary items
    const matchGlossary = glossaryList.filter(item => {
      const matchSearch = !q || 
        item.term.toLowerCase().includes(q) || 
        item.termEn.toLowerCase().includes(q) || 
        item.definition.toLowerCase().includes(q) ||
        item.puilRef.toLowerCase().includes(q);

      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const firstLetter = item.term.charAt(0).toUpperCase();
      const matchLetter = selectedLetter === 'all' || firstLetter === selectedLetter;

      return matchSearch && matchCat && matchLetter;
    });

    // 2. Acronym items
    const matchAcronyms = acronymList.filter(item => {
      const matchSearch = !q || 
        item.abbr.toLowerCase().includes(q) || 
        item.fullNameId.toLowerCase().includes(q) || 
        item.fullNameEn.toLowerCase().includes(q) ||
        item.function.toLowerCase().includes(q);

      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const firstLetter = item.abbr.charAt(0).toUpperCase();
      const matchLetter = selectedLetter === 'all' || firstLetter === selectedLetter;

      return matchSearch && matchCat && matchLetter;
    });

    // 3. Standards items
    const matchStandards = standardsList.filter(item => {
      const matchSearch = !q || 
        item.code.toLowerCase().includes(q) || 
        item.title.toLowerCase().includes(q) || 
        item.summary.toLowerCase().includes(q) ||
        item.issuedBy.toLowerCase().includes(q);

      const matchCat = selectedCategory === 'all' || item.status.includes(selectedCategory);
      return matchSearch && matchCat;
    });

    return {
      glossary: matchGlossary,
      acronyms: matchAcronyms,
      standards: matchStandards,
      totalCount: matchGlossary.length + matchAcronyms.length + matchStandards.length
    };
  }, [searchQuery, selectedCategory, selectedLetter]);

  // Categories list for filtering
  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'Alat Proteksi', label: 'Alat Proteksi' },
    { id: 'Pembumian & Proteksi', label: 'Pembumian' },
    { id: 'Kabel & KHA', label: 'Kabel & KHA' },
    { id: 'Motor & Sirkit', label: 'Motor & Sirkit' },
    { id: 'Regulasi & Standar', label: 'Regulasi & Hukum' }
  ];

  return (
    <div className="space-y-4">

      {/* Top Banner Card */}
      <div className="win10-card bg-gradient-to-r from-sky-950/40 via-slate-900/50 to-slate-900/30 border-sky-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                Glosarium, Akronim & Referensi Standar PUIL
                <span className="win10-badge win10-badge-accent text-[10px]">SNI 0225:2020</span>
              </h1>
              <p className="text-xs text-slate-300">
                Pusat kamus istilah resmi ketenagalistrikan Indonesia, singkatan alat teknis, dan direktori regulasi hukum energi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-sky-400">
              {filteredData.totalCount} Entri Ditemukan
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="win10-card space-y-3">
        {/* Main Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--win-border)] pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeSubTab === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[var(--win-surface-alt)] text-[var(--win-text-secondary)] hover:text-[var(--win-text)] hover:bg-[var(--win-surface-hover)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Modul</span>
              <span className="ml-1 text-[10px] px-1 py-0.2 bg-black/20 rounded-full">
                {filteredData.totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('glossary')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeSubTab === 'glossary'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[var(--win-surface-alt)] text-[var(--win-text-secondary)] hover:text-[var(--win-text)] hover:bg-[var(--win-surface-hover)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glosarium Istilah</span>
              <span className="ml-1 text-[10px] px-1 py-0.2 bg-black/20 rounded-full">
                {filteredData.glossary.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('acronym')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeSubTab === 'acronym'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[var(--win-surface-alt)] text-[var(--win-text-secondary)] hover:text-[var(--win-text)] hover:bg-[var(--win-surface-hover)]'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Akronim & Singkatan</span>
              <span className="ml-1 text-[10px] px-1 py-0.2 bg-black/20 rounded-full">
                {filteredData.acronyms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('standards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeSubTab === 'standards'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[var(--win-surface-alt)] text-[var(--win-text-secondary)] hover:text-[var(--win-text)] hover:bg-[var(--win-surface-hover)]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Referensi & Regulasi</span>
              <span className="ml-1 text-[10px] px-1 py-0.2 bg-black/20 rounded-full">
                {filteredData.standards.length}
              </span>
            </button>
          </div>

          {/* Reset button if filter active */}
          {(searchQuery || selectedCategory !== 'all' || selectedLetter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLetter('all');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Search Input & Category Pills */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah, singkatan (MCB, KHA, BKT), rumus, atau pasal..."
              className="win10-input pl-8 w-full text-xs"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] text-[var(--win-text-muted)] font-semibold shrink-0">Kategori:</span>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/40'
                    : 'bg-[var(--win-surface-alt)] text-[var(--win-text-secondary)] hover:bg-[var(--win-surface-hover)] border border-[var(--win-border)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Letter Jump (A-Z) */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-1 border-t border-[var(--win-border)]">
          <span className="text-[10px] text-[var(--win-text-muted)] font-mono uppercase shrink-0 mr-1">Abjad:</span>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono rounded transition-colors shrink-0 ${
                selectedLetter === letter
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-[var(--win-surface-alt)] text-[var(--win-text-secondary)] hover:bg-[var(--win-surface-hover)]'
              }`}
            >
              {letter === 'all' ? 'All' : letter}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: AKRONIM & SINGKATAN (Grid Table) */}
      {(activeSubTab === 'all' || activeSubTab === 'acronym') && filteredData.acronyms.length > 0 && (
        <div className="win10-card space-y-3">
          <div className="win10-card-header">
            <span className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              <span>Daftar Akronim & Singkatan Standar Kelistrikan</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {filteredData.acronyms.length} Akronim
            </span>
          </div>

          <div className="win10-table-container my-2">
            <table className="win10-table w-full text-xs">
              <thead>
                <tr>
                  <th style={{ width: '90px' }} className="text-center">Akronim</th>
                  <th style={{ width: '26%' }}>Kepanjangan & Istilah</th>
                  <th style={{ width: '15%' }}>Kategori</th>
                  <th style={{ width: '35%' }}>Fungsi Teknis & Peran</th>
                  <th>Standar Rujukan</th>
                  <th style={{ width: '45px' }} className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.acronyms.map((item) => (
                  <tr key={item.abbr}>
                    <td className="text-center">
                      <span className="font-mono font-bold text-sky-400 text-sm bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {item.abbr}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-[var(--win-text)]">{item.fullNameId}</div>
                      {item.fullNameEn && (
                        <div className="text-[11px] text-[var(--win-text-muted)] italic">{item.fullNameEn}</div>
                      )}
                    </td>
                    <td>
                      <span className="win10-badge win10-badge-accent text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="text-[11px] leading-relaxed">
                      {item.function}
                    </td>
                    <td className="font-mono text-[11px] text-[var(--win-text-secondary)]">
                      {item.standard}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleCopy(`${item.abbr} = ${item.fullNameId} (${item.function})`, item.abbr)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        title="Salin definisi"
                      >
                        {copiedKey === item.abbr ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: GLOSARIUM DEFINISI ISTILAH PUIL */}
      {(activeSubTab === 'all' || activeSubTab === 'glossary') && filteredData.glossary.length > 0 && (
        <div className="win10-card space-y-3">
          <div className="win10-card-header">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Glosarium Istilah Teknis PUIL 2011 / 2020</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {filteredData.glossary.length} Istilah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredData.glossary.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded border border-[var(--win-border)] bg-[var(--win-surface-alt)] flex flex-col justify-between hover:border-sky-500/40 transition-all space-y-2.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[var(--win-border)] pb-1.5">
                    <div>
                      <h3 className="font-bold text-sm text-[var(--win-text)] flex items-center gap-2">
                        {item.term}
                      </h3>
                      <div className="text-[11px] text-[var(--win-text-muted)] italic font-sans">
                        {item.termEn}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="win10-badge win10-badge-accent text-[9px]">
                        {item.category}
                      </span>
                      <button
                        onClick={() => handleCopy(`${item.term}: ${item.definition}`, item.id)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        title="Salin definisi"
                      >
                        {copiedKey === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--win-text-secondary)] leading-relaxed pt-1.5">
                    {item.definition}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  {item.example && (
                    <div className="p-2 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      <span className="font-bold text-sky-400 block text-[10px] uppercase font-mono">Penerapan / Contoh:</span>
                      {item.example}
                    </div>
                  )}

                  {item.rule && (
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase font-mono">Kaidah Standar:</span>
                      {item.rule}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--win-text-muted)] pt-1">
                    <span>Pasal Acuan:</span>
                    <span className="font-semibold text-sky-400">{item.puilRef}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: REFERENSI & REGULASI STANDAR NASIONAL */}
      {(activeSubTab === 'all' || activeSubTab === 'standards') && filteredData.standards.length > 0 && (
        <div className="win10-card space-y-3">
          <div className="win10-card-header">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Daftar Dokumen Regulasi & Standar Resmi Indonesia (SNI / PUIL / UU)</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {filteredData.standards.length} Dokumen
            </span>
          </div>

          <div className="space-y-3">
            {filteredData.standards.map((std) => (
              <div 
                key={std.code}
                className="p-3.5 rounded border border-[var(--win-border)] bg-[var(--win-surface-alt)] space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[var(--win-border)] pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-amber-400 text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {std.code}
                    </span>
                    <h3 className="font-bold text-xs text-[var(--win-text)]">
                      {std.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`win10-badge ${std.badgeClass} text-[10px]`}>
                      {std.status}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--win-text-muted)]">
                      Tahun {std.year}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[var(--win-text-secondary)] leading-relaxed">
                  <span className="font-semibold text-[var(--win-text)]">Penerbit: </span>
                  {std.issuedBy}. {std.summary}
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--win-text-muted)] block mb-1">
                    Poin Pokok & Ketentuan Utama:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {std.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-[var(--win-text-secondary)] bg-[var(--win-surface)] p-1.5 rounded border border-[var(--win-border)]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredData.totalCount === 0 && (
        <div className="win10-card text-center py-12 space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="text-sm font-bold text-slate-300">
            Tidak ada entri yang cocok dengan filter "{searchQuery}"
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Coba gunakan kata kunci umum seperti "MCB", "KHA", "BKT", "Pembumian", atau reset filter pencarian.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLetter('all');
            }}
            className="btn-primary text-xs px-4 py-1.5 mx-auto inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* Footer Callout */}
      <div className="win10-callout flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Seluruh definisi dan singkatan mengacu pada dokumen resmi <strong>SNI 0225:2020 (PUIL 2020)</strong> dan regulasi Kementerian ESDM RI.
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          PUIL App by WLDN
        </span>
      </div>

    </div>
  );
}
