import React, { useState } from 'react';
import { 
  WIRE_COLOR_COMPARISON, 
  BATHROOM_ZONES 
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
  Info
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

export default function VisualGuides() {
  const [subTab, setSubTab] = useState('ip'); // default to 'ip' to show the improved IP index
  const [standardView, setStandardView] = useState('current');
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);

  // Interactive IP Decoder states
  const [decodeSolid, setDecodeSolid] = useState('5');
  const [decodeLiquid, setDecodeLiquid] = useState('4');

  const activeSolidInfo = IP_FIRST_DIGIT[decodeSolid] || IP_FIRST_DIGIT[0];
  const activeLiquidInfo = IP_SECOND_DIGIT[decodeLiquid] || IP_SECOND_DIGIT[0];

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
              Standar kode warna penghantar SNI, zonasi keamanan area basah (kamar mandi), dan kode proteksi IP.
            </p>
          </div>

          {/* Sub Navigation Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSubTab('ip')}
              className={`win10-btn ${subTab === 'ip' ? 'win10-btn-primary' : ''}`}
            >
              🛡️ Kode Proteksi IP (Lengkap)
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
              🚿 Zonasi Kamar Mandi
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

    </div>
  );
}
