import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Activity, 
  Flame, 
  HeartHandshake, 
  Zap,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';
import { STANDARD_MCB_RATINGS } from '../data/puilData';

export default function ProtectionCalculator() {
  const [selectedRating, setSelectedRating] = useState(16);
  const [testCurrent, setTestCurrent] = useState(64); // Amperes
  const [rcdApplication, setRcdApplication] = useState('30ma');

  const multiple = (testCurrent / selectedRating).toFixed(1);

  // Determine behavior for curves
  const getCurveStatus = (curveType) => {
    const m = Number(multiple);
    if (curveType === 'B') {
      // 3 - 5 x In
      if (m < 1.13) return { status: 'Aman / Tidak Trip', color: 'text-emerald-400', time: 'Kontinu' };
      if (m <= 1.45) return { status: 'Trip Termal Lambat (Overload)', color: 'text-amber-400', time: '1 - 60 Menit' };
      if (m >= 3 && m <= 5) return { status: 'Trip Magnetik Instan', color: 'text-red-400', time: '< 0.1 Detik (Seketika)' };
      if (m > 5) return { status: 'Hubung Singkat (Trip Seketika)', color: 'text-red-500 font-bold', time: '< 20 Milidetik' };
      return { status: 'Trip Termal Cepat', color: 'text-amber-400', time: 'Beberapa Detik' };
    }
    if (curveType === 'C') {
      // 5 - 10 x In
      if (m < 1.13) return { status: 'Aman / Tidak Trip', color: 'text-emerald-400', time: 'Kontinu' };
      if (m <= 1.45) return { status: 'Trip Termal Lambat (Overload)', color: 'text-amber-400', time: '1 - 60 Menit' };
      if (m >= 5 && m <= 10) return { status: 'Trip Magnetik Instan', color: 'text-red-400', time: '< 0.1 Detik (Seketika)' };
      if (m > 10) return { status: 'Hubung Singkat (Trip Seketika)', color: 'text-red-500 font-bold', time: '< 20 Milidetik' };
      return { status: 'Trip Termal', color: 'text-amber-400', time: 'Beberapa Detik' };
    }
    if (curveType === 'D') {
      // 10 - 20 x In
      if (m < 1.13) return { status: 'Aman / Tidak Trip', color: 'text-emerald-400', time: 'Kontinu' };
      if (m <= 1.45) return { status: 'Trip Termal Lambat (Overload)', color: 'text-amber-400', time: '1 - 60 Menit' };
      if (m >= 10 && m <= 20) return { status: 'Trip Magnetik Instan', color: 'text-red-400', time: '< 0.1 Detik (Seketika)' };
      if (m > 20) return { status: 'Hubung Singkat (Trip Seketika)', color: 'text-red-500 font-bold', time: '< 20 Milidetik' };
      return { status: 'Trip Termal', color: 'text-amber-400', time: 'Tahan Inrush Motor' };
    }
  };

  const statusB = getCurveStatus('B');
  const statusC = getCurveStatus('C');
  const statusD = getCurveStatus('D');

  return (
    <div className="space-y-6">

      {/* Intro Header */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Panduan Proteksi MCB & Gawai Arus Sisa (GPAS / RCD)</h2>
            </div>
            <p className="text-sm text-slate-400">
              Karakteristik kurva trip MCB (SNI IEC 60898) & persyaratan proteksi sentuh langsung PUIL Bagian 411.
            </p>
          </div>
          <span className="badge badge-success">
            Standar Keselamatan PUIL
          </span>
        </div>
      </div>

      {/* Interactive Simulator Section */}
      <div className="calc-container">

        {/* Simulator Controls */}
        <div className="win10-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-amber-400" />
            Simulator Respon Arus MCB
          </h3>

          <div>
            <label className="input-label flex justify-between">
              <span>Arus Nominal Pengenal MCB (In)</span>
              <span className="text-amber-400 font-mono font-bold">{selectedRating} A</span>
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              className="custom-select font-mono"
            >
              {STANDARD_MCB_RATINGS.slice(0, 10).map((r) => (
                <option key={r} value={r}>MCB {r} Ampere</option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label flex justify-between">
              <span>Simulasi Arus Gangguan / Inrush yang Lewat</span>
              <span className="text-sky-400 font-mono font-bold">{testCurrent} A</span>
            </label>
            <input
              type="range"
              min={selectedRating * 0.5}
              max={selectedRating * 25}
              step={selectedRating * 0.5}
              value={testCurrent}
              onChange={(e) => setTestCurrent(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
              <span>{(selectedRating * 0.5).toFixed(0)} A</span>
              <span className="text-amber-400 font-bold">{multiple} × In</span>
              <span>{(selectedRating * 25).toFixed(0)} A</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Multiplikasi Arus:</span>
              <span className="font-mono text-amber-400 text-sm font-bold">{multiple} kali arus In</span>
            </div>
            <p className="text-slate-400">
              Geser slider di atas untuk melihat bagaimana masing-masing kurva (B, C, dan D) merespon kelipatan arus ini.
            </p>
          </div>
        </div>

        {/* Curves Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Curve B */}
          <div className="glass-panel p-5 border-slate-800 flex flex-col justify-between hover:border-sky-500/40 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-lg text-white">Kurva B</span>
                <span className="badge badge-cyan font-mono text-[10px]">3 - 5 × In</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Paling sensitif. Cocok untuk beban resistif murni, pemanas air, dan kabel berjarak sangat jauh.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Respon Pada {testCurrent}A:</span>
              <span className={`text-xs font-semibold block ${statusB.color}`}>{statusB.status}</span>
              <span className="text-[11px] font-mono text-slate-400 block">Waktu: {statusB.time}</span>
            </div>
          </div>

          {/* Curve C */}
          <div className="glass-panel p-5 border-amber-500/30 flex flex-col justify-between shadow-md shadow-amber-500/5 hover:border-amber-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-lg text-amber-400">Kurva C</span>
                <span className="badge badge-warning font-mono text-[10px]">5 - 10 × In</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                <strong>Standar Rumah & Gedung:</strong> Tahan lonjakan sesaat kompresor AC, pompa air, dan lampu LED.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/30 space-y-1">
              <span className="text-[10px] uppercase text-amber-400/80 font-bold block">Respon Pada {testCurrent}A:</span>
              <span className={`text-xs font-semibold block ${statusC.color}`}>{statusC.status}</span>
              <span className="text-[11px] font-mono text-slate-400 block">Waktu: {statusC.time}</span>
            </div>
          </div>

          {/* Curve D */}
          <div className="glass-panel p-5 border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-lg text-white">Kurva D</span>
                <span className="badge badge-success font-mono text-[10px]">10 - 20 × In</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Tahan inrush sangat tinggi. Khusus motor induksi industri, transformator, mesin las, dan sinar-X.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Respon Pada {testCurrent}A:</span>
              <span className={`text-xs font-semibold block ${statusD.color}`}>{statusD.status}</span>
              <span className="text-[11px] font-mono text-slate-400 block">Waktu: {statusD.time}</span>
            </div>
          </div>

        </div>

      </div>

      {/* RCD / GPAS Mandatory PUIL Section */}
      <div className="glass-panel p-6 border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              Gawai Proteksi Arus Sisa (GPAS / RCD / ELCB)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sesuai PUIL 2011/2020 Bagian 411.3.3: Perlindungan mutlak terhadap sengatan listrik dan kebakaran.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setRcdApplication('10ma')}
              className={`win10-btn ${rcdApplication === '10ma' ? 'win10-btn-primary' : ''}`}
            >
              10 mA
            </button>
            <button
              onClick={() => setRcdApplication('30ma')}
              className={`win10-btn ${rcdApplication === '30ma' ? 'win10-btn-primary' : ''}`}
            >
              30 mA (Wajib Stop Kontak)
            </button>
            <button
              onClick={() => setRcdApplication('300ma')}
              className={`win10-btn ${rcdApplication === '300ma' ? 'win10-btn-primary' : ''}`}
            >
              300 mA (Proteksi Api)
            </button>
          </div>
        </div>

        {/* Dynamic Detail Card */}
        {rcdApplication === '30ma' && (
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Sensitivitas 30 mA — Proteksi Nyawa Manusia (Sentuh Langsung)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Kewajiban PUIL:</strong> Arus bocor sekecil 50 mA yang melewati rongga dada manusia dapat memicu fibrilasi ventrikel jantung (kematian mendadak). RCD 30 mA dirancang memutus sirkuit dalam waktu kurang dari <strong>40 milidetik</strong> saat mendeteksi kebocoran arus ke tubuh manusia sebelum mencapai batas fatal.
            </p>
            <div className="text-xs text-emerald-300 font-medium bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-800/40">
              📌 <strong>Wajib dipasang pada:</strong> Semua sirkit kotak kontak (stop kontak) umum di rumah tinggal, kamar mandi, dapur, taman luar, dan stop kontak yang dapat dijangkau oleh orang awam atau anak-anak.
            </div>
          </div>
        )}

        {rcdApplication === '10ma' && (
          <div className="p-5 rounded-xl bg-sky-950/20 border border-sky-500/40 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Zap className="w-5 h-5 text-sky-400" />
              <span>Sensitivitas 10 mA — Perlindungan Tingkat Tinggi Area Sangat Basah</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Digunakan pada area berisiko tinggi di mana resistansi tubuh manusia turun drastis karena basah kuyup (seperti kolam renang, bak pusaran / jacuzzi, sauna, dan instalasi medis rumah sakit).
            </p>
          </div>
        )}

        {rcdApplication === '300ma' && (
          <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Sensitivitas 300 mA — Proteksi Bahaya Kebakaran Isolasi (Fire Protection)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Arus bocor isolasi 300 mA menghasilkan energi panas sekitar 66 Watt pada titik kebocoran. Jika berlangsung lama pada kayu, debu kapas, atau plafon, dapat menyalakan api. RCD 300 mA dipasang pada panel induk (incomer utama) untuk memantau integritas isolasi seluruh gedung.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
