import React, { useState } from 'react';
import { 
  WIRE_COLOR_COMPARISON, 
  BATHROOM_ZONES,
  EARTHING_SYSTEMS
} from '../data/puilData';
import { 
  Palette, 
  Droplets, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Cpu,
  Search,
  SlidersHorizontal,
  Info,
  Zap,
  Globe,
  Activity,
  ArrowRight,
  Layers,
  HelpCircle,
  BookOpen
} from 'lucide-react';


// Data Lengkap Digit 1 (Benda Padat & Debu) - SNI IEC 60529
const IP_FIRST_DIGIT = {
  0: { title: 'Tidak Ada Perlindungan', desc: 'Bebas tersentuh benda atau kontak fisik dari arah manapun.' },
  1: { title: 'Benda Padat > 50 mm', desc: 'Terlindung dari bagian tubuh besar seperti punggung telapak tangan (tidak melindungi jari).' },
  2: { title: 'Benda Padat > 12,5 mm', desc: 'Terlindung dari jari tangan manusia atau benda berukuran serupa (standar minimum IP2X).' },
  3: { title: 'Benda Padat > 2,5 mm', desc: 'Terlindung dari alat kerja seperti obeng, tang kecil, dan kawat berdiameter tebal.' },
  4: { title: 'Benda Padat > 1,0 mm', desc: 'Terlindung dari kawat tipis, paku kecil, dan serangga pengganggu.' },
  5: { title: 'Terlindung Debu (Dust-Protected)', desc: 'Debu dapat masuk dalam jumlah sangat kecil tetapi tidak mengganggu operasi aman alat.' },
  6: { title: 'Kedap Debu Total (Dust-Tight)', desc: 'Tidak ada partikel debu sekecil apapun yang dapat menembus enclosure (vakum penuh).' },
};

// Data Lengkap Digit 2 (Air & Kelembaban) - SNI IEC 60529
const IP_SECOND_DIGIT = {
  0: { title: 'Tidak Ada Perlindungan', desc: 'Tidak ada perlindungan terhadap tetesan atau cairan air.' },
  1: { title: 'Tetesan Vertikal (Kondensasi)', desc: 'Tahan tetesan air jatuh tegak lurus (0° kemiringan) selama 10 menit.' },
  2: { title: 'Tetesan Miring 15°', desc: 'Tahan tetesan air saat enclosure dimiringkan hingga sudut 15°.' },
  3: { title: 'Semprotan Butiran Air 60°', desc: 'Tahan semprotan air butiran kabut hingga kemiringan sudut 60° (hujan berangin).' },
  4: { title: 'Percikan Air (Splash Proof)', desc: 'Tahan cipratan air dari segala arah (360°). Cocok untuk kamar mandi Zona 2 & teras beratap.' },
  5: { title: 'Semprotan Nozzle Tekanan Rendah', desc: 'Tahan semprotan air dari pipa nozzle bertekanan 30 kPa pada jarak 3 meter (12,5 L/menit).' },
  6: { title: 'Semburan Air Deras (Powerful Jet)', desc: 'Tahan semburan air kuat bertekanan 100 kPa dari nozzle 12,5 mm (100 L/menit) dan ombak laut.' },
  7: { title: 'Perendaman Sementara (Immersion)', desc: 'Tahan terendam air hingga kedalaman 0,15 m s.d. 1 meter selama 30 menit.' },
  8: { title: 'Perendaman Kontinu (Submersible)', desc: 'Tahan terendam terus-menerus di bawah air dengan kedalaman yang ditentukan pabrikan (biasanya > 1 m).' },
  '9K': { title: 'Tekanan & Suhu Tinggi (Steam Jet)', desc: 'Tahan cuci semprot uap air bersuhu 80°C dan tekanan sangat tinggi 100 bar (industri food grade/medis).' },
};

// Katalog Peringkat IP Populer & Rekomendasi PUIL
const POPULAR_IP_LIST = [
  {
    code: 'IP00',
    name: 'Bebas Terbuka (Tanpa Proteksi)',
    desc: 'Tidak ada perlindungan fisik dan air.',
    usage: 'Penerapan: Busbar telanjang atau kubikel tegangan tinggi dalam gardu terkunci khusus petugas berizin.',
    badge: 'win10-badge-danger',
    badgeText: 'Area Khusus Terkunci'
  },
  {
    code: 'IP20',
    name: 'Standar Indoor Kering',
    desc: 'Aman dari sentuhan jari (>12,5 mm), tanpa proteksi air.',
    usage: 'Penerapan: Fitting lampu dalam rumah, MCB panel tertutup, sakelar/stop kontak ruang tamu & kamar tidur.',
    badge: 'win10-badge-accent',
    badgeText: 'Indoor Domestik'
  },
  {
    code: 'IP44',
    name: 'Tahan Percikan Air (Splash Proof)',
    desc: 'Tahan benda >1 mm dan cipratan air dari segala sudut.',
    usage: 'Penerapan: Kamar mandi Zona 2 (PUIL 701), teras beratap, area dekat tempat cuci piring (kitchen sink).',
    badge: 'win10-badge-warning',
    badgeText: 'Area Basah / Semi-Outdoor'
  },
  {
    code: 'IP54',
    name: 'Tahan Debu & Percikan Air',
    desc: 'Terlindung dari partikel debu industri dan cipratan air 360°.',
    usage: 'Penerapan: Motor induksi standar, kotak sambung (junction box) bengkel, panel distribusi indoor berdebu.',
    badge: 'win10-badge-warning',
    badgeText: 'Motor Listrik & Industri'
  },
  {
    code: 'IP55',
    name: 'Tahan Debu & Semprotan Air',
    desc: 'Tahan debu dan semprotan air bertekanan rendah dari nozzle.',
    usage: 'Penerapan: Panel kontrol outdoor beratap, exhaust fan dinding luar, gardu distribusi semi-terbuka.',
    badge: 'win10-badge-accent',
    badgeText: 'Outdoor Beratap'
  },
  {
    code: 'IP65',
    name: 'Kedap Debu & Tahan Semprotan',
    desc: 'Kedap debu total dan tahan semprotan air dari segala arah.',
    usage: 'Penerapan: Lampu sorot LED taman, stop kontak outdoor luar ruangan tanpa atap, lampu fasad gedung.',
    badge: 'win10-badge-accent',
    badgeText: 'Outdoor Luar Ruangan'
  },
  {
    code: 'IP66',
    name: 'Kedap Debu & Tahan Ombak / Badai',
    desc: 'Kedap debu total dan tahan semburan air sangat deras serta badai laut.',
    usage: 'Penerapan: Instalasi pelabuhan, tepi laut, pabrik cuci mobil, lampu sorot menara tiang tinggi.',
    badge: 'win10-badge-accent',
    badgeText: 'Cuaca Ekstrem / Maritim'
  },
  {
    code: 'IP67',
    name: 'Perendaman Air Sementara (1 Meter)',
    desc: 'Kedap debu & aman bila terendam air hingga 1 meter (maks 30 menit).',
    usage: 'Penerapan: Lampu taman tertanam dalam tanah (in-ground uplight), instalasi dekat saluran parit drainase.',
    badge: 'win10-badge-success',
    badgeText: 'Tanam Tanah / Rawa'
  },
  {
    code: 'IP68',
    name: 'Perendaman Air Kontinu (Submersible)',
    desc: 'Kedap debu total & tahan bekerja terus menerus di bawah tekanan air.',
    usage: 'Penerapan: Pompa celup air sumur/kolam, lampu underwater kolam renang (Zona 0 PUIL 701), sensor debit tangki air.',
    badge: 'win10-badge-success',
    badgeText: 'Bawah Air (Underwater)'
  },
  {
    code: 'IP69K',
    name: 'Tahan Cuci Steam Tekanan & Suhu Tinggi',
    desc: 'Tahan semprotan air 100 bar bersuhu 80°C dari jarak dekat.',
    usage: 'Penerapan: Industri pengolahan makanan/minuman higienis, farmasi, rumah potong hewan, mesin yang rutin dicuci steam.',
    badge: 'win10-badge-success',
    badgeText: 'Steam Jet Higienis'
  }
];

// SVG Diagram Interaktif untuk Sistem Pembumian Listrik (TT, TN-S, TN-C-S, TN-C, IT)
function EarthingDiagram({ systemId }) {
  const isTT = systemId === 'TT';
  const isTNS = systemId === 'TN-S';
  const isTNCS = systemId === 'TN-C-S';
  const isTNC = systemId === 'TN-C';
  const isIT = systemId === 'IT';

  return (
    <div 
      className="w-full overflow-x-auto p-4 rounded"
      style={{ backgroundColor: 'var(--win-surface-alt)', border: '1px solid var(--win-border)' }}
    >
      <svg viewBox="0 0 760 250" className="w-full min-w-[680px] h-auto font-sans select-none">
        {/* Background Ground Level Plane */}
        <line x1="20" y1="210" x2="740" y2="210" stroke="var(--win-input-border)" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="380" y="226" textAnchor="middle" fill="var(--win-text)" fontSize="10" fontWeight="700" letterSpacing="0.08em">
          BUMI / PERMUKAAN TANAH
        </text>

        {/* ================= LEFT: TRAFO SUMBER (PLN / GARDU) ================= */}
        <rect x="30" y="30" width="150" height="150" rx="4" fill="var(--win-surface)" stroke="#0284c7" strokeWidth="2" />
        <rect x="30" y="30" width="150" height="26" rx="4" fill="#0284c7" />
        <text x="105" y="47" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
          GARDU TRAFO SUMBER
        </text>

        {/* Windings / Symbols inside Trafo */}
        <circle cx="85" cy="85" r="20" fill="none" stroke="var(--win-text)" strokeWidth="2.5" />
        <circle cx="115" cy="85" r="20" fill="none" stroke="var(--win-text)" strokeWidth="2.5" />
        <text x="100" y="125" textAnchor="middle" fill="var(--win-text)" fontSize="10" fontWeight="700">Titik Bintang (N)</text>

        {/* Source Earth Connection */}
        {isIT ? (
          <>
            {/* IT System: Isolated or High Impedance */}
            <line x1="100" y1="135" x2="100" y2="150" stroke="#b45309" strokeWidth="2" />
            <rect x="85" y="150" width="30" height="20" fill="#b45309" stroke="#78350f" strokeWidth="1.5" rx="2" />
            <text x="100" y="164" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">Z</text>
            <line x1="100" y1="170" x2="100" y2="210" stroke="#b45309" strokeWidth="2" />
            {/* Earth Symbol */}
            <line x1="88" y1="210" x2="112" y2="210" stroke="#b45309" strokeWidth="2.5" />
            <line x1="92" y1="214" x2="108" y2="214" stroke="#b45309" strokeWidth="2" />
            <line x1="96" y1="218" x2="104" y2="218" stroke="#b45309" strokeWidth="1.5" />
            <text x="100" y="235" textAnchor="middle" fill="var(--win-warning)" fontSize="9" fontWeight="700">Z ≥ 1000 Ω (Rb)</text>
          </>
        ) : (
          <>
            {/* Direct Earthing of Source Neutral (TT, TN-S, TN-C, TN-C-S) */}
            <line x1="100" y1="135" x2="100" y2="210" stroke="#107c10" strokeWidth="2.5" />
            {/* Earth Symbol */}
            <line x1="88" y1="210" x2="112" y2="210" stroke="#107c10" strokeWidth="2.5" />
            <line x1="92" y1="214" x2="108" y2="214" stroke="#107c10" strokeWidth="2" />
            <line x1="96" y1="218" x2="104" y2="218" stroke="#107c10" strokeWidth="1.5" />
            <text x="100" y="235" textAnchor="middle" fill="var(--win-success-text)" fontSize="9" fontWeight="700">Rb (Tanah Trafo)</text>
          </>
        )}

        {/* Terminals on Source */}
        <circle cx="180" cy="70" r="5" fill="#b45309" />
        <text x="165" y="74" fill="var(--win-text)" fontSize="11" fontWeight="800">L</text>

        <circle cx="180" cy="115" r="5" fill="#0284c7" />
        <text x="165" y="119" fill="var(--win-text)" fontSize="11" fontWeight="800">N</text>

        {isTNS && (
          <>
            <circle cx="180" cy="155" r="5" fill="#107c10" />
            <text x="160" y="159" fill="var(--win-text)" fontSize="11" fontWeight="800">PE</text>
            <line x1="100" y1="135" x2="180" y2="155" stroke="#107c10" strokeWidth="2" strokeDasharray="3,2" />
          </>
        )}

        {/* ================= MIDDLE: CONDUCTOR WIRES ================= */}
        {/* Phase Wire L */}
        <line x1="180" y1="70" x2="520" y2="70" stroke="#b45309" strokeWidth="3" />
        <rect x="330" y="58" width="80" height="20" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1" />
        <text x="370" y="72" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Fasa (L)</text>

        {/* Neutral / PEN Wires */}
        {isTNC ? (
          /* PEN Wire */
          <>
            <line x1="180" y1="115" x2="520" y2="115" stroke="#059669" strokeWidth="3.5" />
            <line x1="180" y1="115" x2="520" y2="115" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="8,6" />
            <rect x="295" y="104" width="150" height="20" rx="3" fill="#059669" stroke="#047857" strokeWidth="1" />
            <text x="370" y="118" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Kawat PEN (N + PE)</text>
          </>
        ) : isTNCS ? (
          /* TN-C-S Incoming PEN */
          <>
            <line x1="180" y1="115" x2="520" y2="115" stroke="#059669" strokeWidth="3.5" />
            <line x1="180" y1="115" x2="520" y2="115" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="8,6" />
            <rect x="285" y="104" width="170" height="20" rx="3" fill="#059669" stroke="#047857" strokeWidth="1" />
            <text x="370" y="118" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Distribusi Luar: Kawat PEN</text>
          </>
        ) : (
          /* Standard Neutral N */
          <>
            <line x1="180" y1="115" x2="520" y2="115" stroke="#0284c7" strokeWidth="3" />
            <rect x="330" y="104" width="80" height="20" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
            <text x="370" y="118" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Netral (N)</text>
          </>
        )}

        {/* Protective Earth PE Wire from Source (Only in TN-S) */}
        {isTNS && (
          <>
            <line x1="180" y1="155" x2="520" y2="155" stroke="#107c10" strokeWidth="3" strokeDasharray="6,3" />
            <rect x="300" y="144" width="140" height="20" rx="3" fill="#107c10" stroke="#0e6b0e" strokeWidth="1" />
            <text x="370" y="158" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">PE Terpisah (5-Kawat)</text>
          </>
        )}

        {isTT && (
          <text x="370" y="165" textAnchor="middle" fill="var(--win-text)" fontSize="10" fontStyle="italic" fontWeight="700">
            (Tanpa Kawat Proteksi PE dari PLN - Pembumian Mandiri di Rumah)
          </text>
        )}

        {/* ================= RIGHT: INSTALASI KONSUMEN ================= */}
        <rect x="520" y="30" width="210" height="155" rx="4" fill="var(--win-surface)" stroke={isTT ? '#059669' : '#0284c7'} strokeWidth="2" />
        <rect x="520" y="30" width="210" height="26" rx="4" fill={isTT ? '#059669' : '#0284c7'} />
        <text x="625" y="47" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
          {isTT ? 'RUMAH KONSUMEN (PLN)' : 'INSTALASI BEBAN KONSUMEN'}
        </text>

        {/* Consumer Appliance Box with Metallic Frame (BKT) */}
        <rect x="590" y="65" width="125" height="85" rx="3" fill="var(--win-surface-alt)" stroke="var(--win-border)" strokeWidth="2" strokeDasharray="4,2" />
        <text x="652" y="83" textAnchor="middle" fill="var(--win-text)" fontSize="10" fontWeight="800">
          BEBAN / PERALATAN
        </text>
        <text x="652" y="97" textAnchor="middle" fill="var(--win-text)" fontSize="9" fontWeight="700">
          Bodi Logam (BKT)
        </text>

        {/* Internal load wiring */}
        <line x1="520" y1="70" x2="610" y2="70" stroke="#b45309" strokeWidth="2.5" />
        <circle cx="610" cy="70" r="3" fill="#b45309" />

        {isTT && (
          <>
            {/* RCD 30mA Box in TT */}
            <rect x="535" y="58" width="42" height="68" rx="2" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <text x="556" y="88" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">RCD</text>
            <text x="556" y="101" textAnchor="middle" fill="#e6fffa" fontSize="8" fontWeight="700">30mA</text>
          </>
        )}

        {/* Consumer Neutral connection */}
        {isTNC ? (
          <>
            <line x1="520" y1="115" x2="610" y2="115" stroke="#059669" strokeWidth="2.5" />
            <circle cx="610" cy="115" r="3" fill="#059669" />
            {/* Jumper PEN directly to chassis in TN-C */}
            <line x1="610" y1="115" x2="610" y2="140" stroke="#107c10" strokeWidth="2.5" />
            <line x1="610" y1="140" x2="650" y2="140" stroke="#107c10" strokeWidth="2.5" />
            <text x="660" y="135" fill="var(--win-danger)" fontSize="8" fontWeight="700">Jumper Bodi</text>
          </>
        ) : isTNCS ? (
          <>
            {/* Split PEN into N and PE at Main Panel */}
            <line x1="520" y1="115" x2="545" y2="115" stroke="#059669" strokeWidth="3" />
            <circle cx="545" cy="115" r="4" fill="#b45309" />
            <text x="545" y="106" textAnchor="middle" fill="var(--win-text)" fontSize="8" fontWeight="800">SPLIT</text>
            {/* Neutral to load */}
            <line x1="545" y1="115" x2="610" y2="115" stroke="#0284c7" strokeWidth="2.5" />
            {/* PE bus to chassis */}
            <line x1="545" y1="115" x2="545" y2="155" stroke="#107c10" strokeWidth="2.5" />
            <line x1="545" y1="155" x2="650" y2="155" stroke="#107c10" strokeWidth="2.5" />
            <line x1="650" y1="155" x2="650" y2="150" stroke="#107c10" strokeWidth="2.5" />
            {/* Auxiliary Earth Rod for TN-C-S */}
            <line x1="545" y1="155" x2="545" y2="210" stroke="#107c10" strokeWidth="2" />
            <line x1="535" y1="210" x2="555" y2="210" stroke="#107c10" strokeWidth="2" />
            <line x1="538" y1="214" x2="552" y2="214" stroke="#107c10" strokeWidth="1.5" />
            <text x="545" y="226" textAnchor="middle" fill="var(--win-success-text)" fontSize="8" fontWeight="700">Ra Bantu</text>
          </>
        ) : (
          <>
            <line x1="520" y1="115" x2="610" y2="115" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="610" cy="115" r="3" fill="#0284c7" />
          </>
        )}

        {/* Chassis Grounding to Ground Rod (TT and IT) */}
        {(isTT || isIT) && (
          <>
            <line x1="650" y1="150" x2="650" y2="210" stroke="#107c10" strokeWidth="3" />
            <circle cx="650" cy="150" r="3.5" fill="#107c10" />
            {/* Earth Rod Symbol */}
            <line x1="638" y1="210" x2="662" y2="210" stroke="#107c10" strokeWidth="3" />
            <line x1="642" y1="214" x2="658" y2="214" stroke="#107c10" strokeWidth="2" />
            <line x1="646" y1="218" x2="654" y2="218" stroke="#107c10" strokeWidth="1.5" />
            <text x="650" y="235" textAnchor="middle" fill="var(--win-success-text)" fontSize="9" fontWeight="700">
              {isTT ? 'Ra ≤ 5 Ω (Pasak Lokal)' : 'Ra Mandiri (Lokal)'}
            </text>
          </>
        )}

        {/* TN-S chassis connection to PE wire */}
        {isTNS && (
          <>
            <line x1="520" y1="155" x2="650" y2="155" stroke="#107c10" strokeWidth="2.5" />
            <line x1="650" y1="155" x2="650" y2="150" stroke="#107c10" strokeWidth="2.5" />
            <circle cx="650" cy="150" r="3.5" fill="#107c10" />
            <text x="650" y="172" textAnchor="middle" fill="var(--win-success-text)" fontSize="8" fontWeight="700">
              Kembali ke N via PE
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export default function VisualGuides() {
  const [subTab, setSubTab] = useState('earthing'); // default to earthing to showcase the new feature
  const [standardView, setStandardView] = useState('current');
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [selectedEarthingId, setSelectedEarthingId] = useState('TT');

  // Interactive IP Decoder states
  const [decodeSolid, setDecodeSolid] = useState('5');
  const [decodeLiquid, setDecodeLiquid] = useState('4');

  const activeSolidInfo = IP_FIRST_DIGIT[decodeSolid] || IP_FIRST_DIGIT[0];
  const activeLiquidInfo = IP_SECOND_DIGIT[decodeLiquid] || IP_SECOND_DIGIT[0];
  const activeEarthingSystem = EARTHING_SYSTEMS.find(s => s.id === selectedEarthingId) || EARTHING_SYSTEMS[0];

  return (
    <div className="space-y-4">

      {/* Intro Header */}
      <div className="win10-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-sky-500" />
              <h2 className="text-base font-bold text-white">Panduan Visual & Referensi Praktis PUIL</h2>
            </div>
            <p className="text-xs text-slate-400">
              Sistem pembumian distribusi (TT, TN, IT), standar warna kabel SNI, zonasi kamar mandi, dan proteksi IP.
            </p>
          </div>

          {/* Sub Navigation Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSubTab('earthing')}
              className={`win10-btn ${subTab === 'earthing' ? 'win10-btn-primary' : ''}`}
            >
              ⚡ Sistem Pembumian (TT, TN, IT)
            </button>
            <button
              onClick={() => setSubTab('ip')}
              className={`win10-btn ${subTab === 'ip' ? 'win10-btn-primary' : ''}`}
            >
              🛡️ Kode Proteksi IP
            </button>
            <button
              onClick={() => setSubTab('colors')}
              className={`win10-btn ${subTab === 'colors' ? 'win10-btn-primary' : ''}`}
            >
              🎨 Warna Kabel SNI
            </button>
            <button
              onClick={() => setSubTab('zones')}
              className={`win10-btn ${subTab === 'zones' ? 'win10-btn-primary' : ''}`}
            >
              🚿 Kamar Mandi
            </button>
          </div>
        </div>
      </div>


      {/* SUB-TAB: IP CODE INDEX & DECODER WIZARD */}
      {subTab === 'ip' && (
        <div className="space-y-4">
          
          {/* 1. Interactive IP Decoder Tool */}
          <div className="win10-card space-y-3">
            <div className="win10-card-header">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                Dekoder & Simulator Kode IP Interaktif (SNI IEC 60529 / PUIL)
              </span>
              <span className="win10-badge win10-badge-accent font-mono">
                Hasil: IP{decodeSolid}{decodeLiquid}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Pilih kombinasi digit pertama dan kedua di bawah untuk melihat tingkat ketahanan dan rekomendasi penempatannya:
            </p>

            {/* Selectors Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              
              {/* Digit 1 Selector */}
              <div>
                <label className="input-label">Digit 1: Benda Padat & Debu (0 - 6)</label>
                <select
                  value={decodeSolid}
                  onChange={(e) => setDecodeSolid(e.target.value)}
                  className="win10-select font-mono"
                >
                  <option value="0">0 - Tanpa proteksi benda padat</option>
                  <option value="1">1 - Terlindung benda &gt; 50 mm (punggung tangan)</option>
                  <option value="2">2 - Terlindung benda &gt; 12,5 mm (jari tangan / IP2X)</option>
                  <option value="3">3 - Terlindung benda &gt; 2,5 mm (alat obeng/kawat tebal)</option>
                  <option value="4">4 - Terlindung benda &gt; 1,0 mm (kawat tipis/paku)</option>
                  <option value="5">5 - Terlindung debu (Dust Protected)</option>
                  <option value="6">6 - Kedap debu total (Dust Tight)</option>
                </select>
              </div>

              {/* Digit 2 Selector */}
              <div>
                <label className="input-label">Digit 2: Air & Kelembaban (0 - 9K)</label>
                <select
                  value={decodeLiquid}
                  onChange={(e) => setDecodeLiquid(e.target.value)}
                  className="win10-select font-mono"
                >
                  <option value="0">0 - Tanpa proteksi air</option>
                  <option value="1">1 - Tetesan air vertikal 0° (kondensasi)</option>
                  <option value="2">2 - Tetesan air miring hingga 15°</option>
                  <option value="3">3 - Semprotan butiran air sudut 60° (hujan berangin)</option>
                  <option value="4">4 - Percikan air dari segala arah 360° (Splash Proof)</option>
                  <option value="5">5 - Semprotan nozzle tekanan rendah 30 kPa</option>
                  <option value="6">6 - Semburan deras 100 kPa & ombak laut</option>
                  <option value="7">7 - Perendaman sementara (s.d. 1 m, 30 menit)</option>
                  <option value="8">8 - Perendaman kontinu underwater</option>
                  <option value="9K">9K - Semprot uap bertekanan 100 bar & suhu 80°C</option>
                </select>
              </div>

            </div>

            {/* Live Result Display Box */}
            <div className="p-3.5 rounded bg-slate-900 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 font-black text-2xl font-mono">
                  IP{decodeSolid}{decodeLiquid}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {activeSolidInfo.title} + {activeLiquidInfo.title}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    • <strong>Benda Padat:</strong> {activeSolidInfo.desc}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    • <strong>Air/Cairan:</strong> {activeLiquidInfo.desc}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Popular Ratings Catalog in Electrical Projects */}
          <div className="win10-card space-y-3">
            <div className="win10-card-header">
              <span>Katalog Peringkat IP Standar dalam Proyek Instalasi Listrik (10 Rating Populer)</span>
              <span className="text-xs font-mono text-slate-400">PUIL 2011/2020 & SNI IEC 60529</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {POPULAR_IP_LIST.map((item) => (
                <div key={item.code} className="win10-card p-3 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-sky-400 font-mono">
                        {item.code}
                      </span>
                      <span className={`win10-badge ${item.badge} text-[10px]`}>
                        {item.badgeText}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white mb-0.5">{item.name}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
                    {item.usage}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Reference Summary Table: Digit 1 vs Digit 2 */}
          <div className="win10-card space-y-3">
            <div className="win10-card-header">
              <span>Tabel Ringkasan Tingkat Proteksi: Digit Pertama vs Digit Kedua</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Digit 1 summary list */}
              <div className="space-y-1.5 p-3 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 block pb-1 border-b border-slate-800">
                  Digit 1: Perlindungan Benda Padat & Debu
                </span>
                {Object.entries(IP_FIRST_DIGIT).map(([num, val]) => (
                  <div key={num} className="flex items-start gap-2 py-0.5">
                    <span className="font-mono font-bold text-sky-400 w-4 shrink-0">{num}:</span>
                    <span className="text-slate-300 text-[11px]">{val.title}</span>
                  </div>
                ))}
              </div>

              {/* Digit 2 summary list */}
              <div className="space-y-1.5 p-3 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-sky-400 block pb-1 border-b border-slate-800">
                  Digit 2: Perlindungan Air & Kelembaban
                </span>
                {Object.entries(IP_SECOND_DIGIT).map(([num, val]) => (
                  <div key={num} className="flex items-start gap-2 py-0.5">
                    <span className="font-mono font-bold text-sky-400 w-7 shrink-0">{num}:</span>
                    <span className="text-slate-300 text-[11px]">{val.title}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: CABLE COLOR CODE */}
      {subTab === 'colors' && (
        <div className="win10-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Standar Kode Warna Penghantar PUIL</h3>
              <p className="text-xs text-slate-400">
                Bandingkan standar modern (PUIL 2011/2020 / SNI IEC 60446) dengan standar lama (PUIL 2000).
              </p>
            </div>

            {/* Toggle Current vs Old */}
            <div className="win10-segmented" style={{ minWidth: '320px' }}>
              <button
                onClick={() => setStandardView('current')}
                className={`win10-segment-btn ${standardView === 'current' ? 'active' : ''}`}
              >
                Standar Baru (PUIL 2011 & 2020)
              </button>
              <button
                onClick={() => setStandardView('old')}
                className={`win10-segment-btn ${standardView === 'old' ? 'active' : ''}`}
              >
                Standar Lama (PUIL 2000)
              </button>
            </div>
          </div>

          {/* Wire Cards Grid */}
          <div className="wire-cards-grid">
            {WIRE_COLOR_COMPARISON.map((wire, idx) => {
              const item = standardView === 'current' ? wire.current : wire.old;
              const isStriped = !!item.stripe;

              return (
                <div key={idx} className="wire-card">
                  <div>
                    {/* Wire Graphic Strip */}
                    <div className="wire-preview">
                      {isStriped ? (
                        <div 
                          className="w-full h-full"
                          style={{
                            background: `repeating-linear-gradient(45deg, #eab308, #eab308 10px, #16a34a 10px, #16a34a 20px)`
                          }}
                        ></div>
                      ) : (
                        <div 
                          className="w-full h-full" 
                          style={{ backgroundColor: item.hex }}
                        ></div>
                      )}
                      <span className="absolute px-2 py-0.5 rounded text-[11px] font-bold bg-black/75 text-white border border-white/20 font-mono">
                        {wire.phase.split(' ')[0]} {wire.phase.split(' ')[1]}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-white">{wire.phase}</div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">{item.name}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-tight">
                    {wire.notes}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Field Notice Callout */}
          <div className="win10-callout flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong>Peringatan Renovasi & Pekerjaan Lapangan:</strong> Banyak instalasi rumah lama di Indonesia masih memakai standar PUIL 2000 (Fasa R = Merah, Fasa S = Kuning, Fasa T = Hitam). Selalu tes tegangan dengan tespen atau multimeter sebelum menyentuh kabel!
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: BATHROOM ZONING */}
      {subTab === 'zones' && (
        <div className="win10-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              Zonasi Keselamatan Listrik Kamar Mandi (PUIL Bagian 701)
            </h3>
            <p className="text-xs text-slate-400">
              Resistansi tubuh manusia turun hingga 10% saat basah kuyup. Klik zona di bawah untuk melihat batas peralatan & proteksi.
            </p>
          </div>

          {/* Zone Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {BATHROOM_ZONES.map((z, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedZoneIndex(idx)}
                className={`win10-card text-left p-3 cursor-pointer transition ${
                  selectedZoneIndex === idx
                    ? 'border-sky-500'
                    : ''
                }`}
                style={selectedZoneIndex === idx ? { borderColor: 'var(--win-accent)', backgroundColor: 'var(--win-accent-bg)' } : {}}
              >
                <div className="text-xs font-bold text-sky-400 font-mono mb-1">
                  {z.zone}
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">{z.title}</div>
              </button>
            ))}
          </div>

          {/* Active Zone Detail Card */}
          {(() => {
            const activeZone = BATHROOM_ZONES[selectedZoneIndex];
            return (
              <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-sky-400 font-mono">{activeZone.zone}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{activeZone.title}</h4>
                  </div>
                  <span className="win10-badge win10-badge-warning font-mono">
                    Proteksi: {activeZone.ipRating}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeZone.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded bg-slate-950 border border-emerald-500/30">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Peralatan & Tegangan Diizinkan:
                    </span>
                    <p className="text-xs text-slate-300">{activeZone.voltage}</p>
                  </div>

                  <div className="p-3 rounded bg-slate-950 border border-red-500/30">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5" />
                      Larangan Keras PUIL:
                    </span>
                    <p className="text-xs text-slate-300">{activeZone.prohibited}</p>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* SUB-TAB: SISTEM PEMBUMIAN DISTRIBUSI TENAGA LISTRIK (TT, TN-S, TN-C-S, TN-C, IT) */}
      {subTab === 'earthing' && (
        <div className="space-y-4">

          {/* 1. Selector Buttons for 5 Earthing Systems */}
          <div className="win10-card space-y-3">
            <div className="win10-card-header">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Pilih Sistem Pembumian Distribusi (PUIL 2011 Bagian 312.2 / SNI IEC 60364)
              </span>
              <span className="text-xs font-mono text-slate-400">
                5 Klasifikasi Standar Internasional
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {EARTHING_SYSTEMS.map((sys) => {
                const isActive = sys.id === selectedEarthingId;
                return (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedEarthingId(sys.id)}
                    className={`win10-btn text-left p-2.5 flex flex-col items-start gap-1 ${
                      isActive ? 'win10-btn-primary' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs">{sys.name}</span>
                      {sys.isIndonesiaPlnStandard && (
                        <span className={`text-[9px] px-1 py-0.5 rounded font-mono font-bold ${
                          isActive ? 'bg-white text-sky-800' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          PLN RI
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-80 line-clamp-1">
                      {sys.badgeText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Active System Interactive Schematic & Detailed Card */}
          <div className="win10-card space-y-4">
            
            {/* Header with Title and Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-sky-400 font-mono">
                    {activeEarthingSystem.name}
                  </span>
                  <span className="win10-badge win10-badge-accent font-bold">
                    {activeEarthingSystem.badgeText}
                  </span>
                  {activeEarthingSystem.isIndonesiaPlnStandard && (
                    <span className="win10-badge win10-badge-success font-bold">
                      🇮🇩 Standar Wajib Pelanggan PLN
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">
                  {activeEarthingSystem.fullName}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-mono block">Kode Huruf IEC 60364</span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {activeEarthingSystem.id}
                </span>
              </div>
            </div>

            {/* Code Meaning Breakdown Callout */}
            <div className="p-3 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1.5 font-mono">
              <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wider mb-1">
                Makna Akronim Bahasa (Prancis / Latin):
              </span>
              <div className="flex items-start gap-2">
                <span className="text-sky-400 font-bold shrink-0">Huruf ke-1:</span>
                <span className="text-slate-300">{activeEarthingSystem.codeMeaning.first}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">Huruf ke-2:</span>
                <span className="text-slate-300">{activeEarthingSystem.codeMeaning.second}</span>
              </div>
              {activeEarthingSystem.codeMeaning.third && (
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">Huruf ke-3/4:</span>
                  <span className="text-slate-300">{activeEarthingSystem.codeMeaning.third}</span>
                </div>
              )}
            </div>

            {/* Circuit Schematic Diagram SVG */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  Diagram Rangkaian Sirkit Pembumian ({activeEarthingSystem.id})
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Skematik Jalur Fasa (L), Netral (N), Proteksi (PE), & Tanah
                </span>
              </div>

              <EarthingDiagram systemId={activeEarthingSystem.id} />
            </div>

            {/* Summary text */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800">
              {activeEarthingSystem.summary}
            </p>

            {/* 2-Column Technical Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Left Column: Conductors & Protection Rules */}
              <div className="space-y-3">
                <div className="p-3.5 rounded bg-slate-900/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 pb-1 border-b border-slate-800">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    Penghantar & Kabel Jalur Distribusi:
                  </span>
                  <p className="text-xs text-slate-300 font-mono">
                    {activeEarthingSystem.conductors}
                  </p>
                </div>

                <div className="p-3.5 rounded bg-slate-900/70 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Persyaratan Proteksi Wajib PUIL:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeEarthingSystem.protectionRequired}
                  </p>
                </div>
              </div>

              {/* Right Column: Pros, Cons & Applications */}
              <div className="space-y-3">
                <div className="p-3.5 rounded bg-slate-900/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Keunggulan Sistem:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeEarthingSystem.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 pt-2 pb-1 border-b border-slate-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    Kekurangan / Batasan Kritis:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeEarthingSystem.disadvantages.map((dis, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded bg-slate-900/70 border border-sky-500/30">
                  <span className="text-xs font-bold text-sky-400 block mb-1">
                    📌 Penerapan Lazim di Lapangan:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeEarthingSystem.applications}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* 3. Comprehensive Comparison Table (PUIL & IEC 60364) */}
          <div className="win10-card space-y-3">
            <div className="win10-card-header">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Tabel Perbandingan 5 Sistem Pembumian PUIL 2011 / 2020
              </span>
              <span className="text-xs font-mono text-slate-400">Ringkasan Referensi Cepat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="win10-table w-full text-xs">
                <thead>
                  <tr>
                    <th>Sistem</th>
                    <th>Titik Netral Trafo (Sumber)</th>
                    <th>Bodi Beban Konsumen (BKT)</th>
                    <th>Jumlah Kawat (3-Fasa)</th>
                    <th>Proteksi Wajib</th>
                    <th>Standar Indonesia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={selectedEarthingId === 'TT' ? 'bg-sky-500/10' : ''}>
                    <td className="font-bold font-mono text-sky-400">TT</td>
                    <td>Ditanahkan langsung (Rb)</td>
                    <td>Ditanahkan mandiri (Ra ≤ 5 Ω)</td>
                    <td className="font-mono">4 kawat (L1, L2, L3, N)</td>
                    <td><strong>RCD / GPAS 30mA (Wajib)</strong></td>
                    <td><span className="win10-badge win10-badge-success">Standar Resmi PLN Rumah</span></td>
                  </tr>
                  <tr className={selectedEarthingId === 'TN-S' ? 'bg-sky-500/10' : ''}>
                    <td className="font-bold font-mono text-emerald-400">TN-S</td>
                    <td>Ditanahkan langsung (Rb)</td>
                    <td>Terhubung ke kabel PE sumber</td>
                    <td className="font-mono">5 kawat (L1, L2, L3, N, PE)</td>
                    <td>MCB / Sekring & RCD</td>
                    <td>Data Center & Rumah Sakit</td>
                  </tr>
                  <tr className={selectedEarthingId === 'TN-C-S' ? 'bg-sky-500/10' : ''}>
                    <td className="font-bold font-mono text-amber-400">TN-C-S</td>
                    <td>Ditanahkan langsung (Rb)</td>
                    <td>Terhubung ke PE dipecah di PDB</td>
                    <td className="font-mono">4 kawat (PEN) lalu 5 kawat</td>
                    <td>MCB & RCD (setelah split)</td>
                    <td>Gedung Komersial & Industri</td>
                  </tr>
                  <tr className={selectedEarthingId === 'TN-C' ? 'bg-sky-500/10' : ''}>
                    <td className="font-bold font-mono text-slate-300">TN-C</td>
                    <td>Ditanahkan langsung (Rb)</td>
                    <td>Terhubung ke kawat PEN</td>
                    <td className="font-mono">4 kawat (L1, L2, L3, PEN)</td>
                    <td>MCB (<strong>Dilarang RCD</strong>)</td>
                    <td>Khusus Feeder Utama Hulu</td>
                  </tr>
                  <tr className={selectedEarthingId === 'IT' ? 'bg-sky-500/10' : ''}>
                    <td className="font-bold font-mono text-purple-400">IT</td>
                    <td>Diisolasi / Impedansi Z tinggi</td>
                    <td>Ditanahkan mandiri (Ra)</td>
                    <td className="font-mono">3 / 4 kawat termonitor</td>
                    <td><strong>IMD (Insulation Monitor)</strong></td>
                    <td>Ruang Operasi RS (Kamar Bedah)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

