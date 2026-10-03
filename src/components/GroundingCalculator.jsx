import React, { useState, useMemo } from 'react';
import { SOIL_RESISTIVITY } from '../data/puilData';
import { 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  HelpCircle,
  Sparkles,
  ArrowDownCircle,
  PlusCircle
} from 'lucide-react';

export default function GroundingCalculator() {
  const [selectedSoilId, setSelectedSoilId] = useState('clay');
  const [customRho, setCustomRho] = useState(100);
  const [rodLength, setRodLength] = useState(3.0); // 3.0 meters standard
  const [rodDiameter, setRodDiameter] = useState(16); // 16mm (5/8 inch)
  const [rodCount, setRodCount] = useState(1); // 1, 2, 3, 4 parallel rods

  const selectedSoil = SOIL_RESISTIVITY.find(s => s.id === selectedSoilId) || SOIL_RESISTIVITY[1];

  const calculation = useMemo(() => {
    const rho = selectedSoilId === 'custom' ? Number(customRho) : selectedSoil.rho;
    const L = Number(rodLength); // meters
    const d = Number(rodDiameter) / 1000; // convert mm to meters
    const n = Number(rodCount); // number of rods

    // Single rod grounding formula (Dwight / IEEE Std 142 / PUIL):
    // R = (rho / (2 * PI * L)) * (ln(4L / d) - 1)
    const singleRodR = (rho / (2 * Math.PI * L)) * (Math.log((4 * L) / d) - 1);

    // Parallel rods with distance >= L (efficiency factor eta ~ 0.9)
    const efficiency = n === 1 ? 1.0 : n === 2 ? 0.90 : n === 3 ? 0.85 : 0.80;
    const totalR = singleRodR / (n * efficiency);

    const isCompliant = totalR <= 5.0; // PUIL target <= 5 Ohm
    const isExcellent = totalR <= 2.0; // Ideal for electronics & lightning

    // Estimate rods needed to reach <= 5 Ohm
    let rodsNeededFor5Ohm = 1;
    for (let i = 1; i <= 10; i++) {
      const eff = i === 1 ? 1.0 : i === 2 ? 0.90 : i === 3 ? 0.85 : 0.80;
      if (singleRodR / (i * eff) <= 5.0) {
        rodsNeededFor5Ohm = i;
        break;
      }
    }

    return {
      rho,
      singleRodR: singleRodR.toFixed(2),
      totalR: totalR.toFixed(2),
      isCompliant,
      isExcellent,
      rodsNeededFor5Ohm
    };
  }, [selectedSoilId, customRho, selectedSoil, rodLength, rodDiameter, rodCount]);

  return (
    <div className="space-y-6">

      {/* Intro Header */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Kalkulator Tahanan Pembumian (Grounding)</h2>
            </div>
            <p className="text-sm text-slate-400">
              Perhitungan nilai tahanan elektroda pasak batang tunggal & paralel sesuai PUIL 2011/2020 Bagian 542 (Target &le; 5 &Omega;).
            </p>
          </div>
          <span className="badge badge-success font-mono">
            Batas Maks PUIL: 5.0 Ω
          </span>
        </div>
      </div>

      <div className="calc-container">

        {/* Input Parameters */}
        <div className="space-y-4">
          <div className="win10-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
              <Layers className="w-4 h-4 text-emerald-400" />
              Karakteristik Tanah & Pasak Elektroda
            </h3>

            {/* Soil Type Selection */}
            <div>
              <label className="input-label">Jenis & Karakter Tanah Lokasi</label>
              <select
                value={selectedSoilId}
                onChange={(e) => setSelectedSoilId(e.target.value)}
                className="custom-select"
              >
                {SOIL_RESISTIVITY.map((soil) => (
                  <option key={soil.id} value={soil.id}>
                    {soil.name} (ρ ≈ {soil.rho} Ω·m)
                  </option>
                ))}
                <option value="custom">Kustom (Input Nilai Pengukuran Tanah Sendiri)</option>
              </select>
              <span className="text-xs text-slate-400 mt-1 block">
                {selectedSoilId === 'custom' ? 'Masukkan nilai resistivitas tanah terukur' : selectedSoil.desc}
              </span>
            </div>

            {selectedSoilId === 'custom' && (
              <div>
                <label className="input-label">Resistivitas Tanah Kustom (Ohm·meter)</label>
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={customRho}
                  onChange={(e) => setCustomRho(Number(e.target.value))}
                  className="custom-input font-mono"
                  placeholder="Contoh: 120"
                />
              </div>
            )}

            {/* Rod Length & Diameter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Panjang Batang Pasak Elektroda (L)</label>
                <select
                  value={rodLength}
                  onChange={(e) => setRodLength(Number(e.target.value))}
                  className="custom-select font-mono"
                >
                  <option value="1.5">1.5 Meter (Pendek)</option>
                  <option value="2.4">2.4 Meter (Standar 8 Feet)</option>
                  <option value="3.0">3.0 Meter (Standar Proyek SNI)</option>
                  <option value="4.5">4.5 Meter (Disambung Coupler)</option>
                  <option value="6.0">6.0 Meter (Pentanahan Dalam)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Diameter Batang Tembaga (d)</label>
                <select
                  value={rodDiameter}
                  onChange={(e) => setRodDiameter(Number(e.target.value))}
                  className="custom-select font-mono"
                >
                  <option value="12">12 mm (1/2 inch)</option>
                  <option value="16">16 mm (5/8 inch - Paling Umum)</option>
                  <option value="19">19 mm (3/4 inch)</option>
                  <option value="25">25 mm (1 inch - Heavy Duty)</option>
                </select>
              </div>
            </div>

            {/* Parallel Rods */}
            <div>
              <label className="input-label flex justify-between">
                <span>Jumlah Batang Elektroda Paralel</span>
                <span className="text-emerald-400 font-bold font-mono">{rodCount} Batang Pasak</span>
              </label>
              <div className="win10-segmented">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setRodCount(count)}
                    className={`win10-segment-btn ${rodCount === count ? 'active' : ''}`}
                  >
                    {count} Batang
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                Catatan PUIL: Jarak antar pasak paralel minimal sama dengan panjang batang (misal jarak &ge; 3 meter).
              </span>
            </div>

          </div>
        </div>

        {/* Calculation Output Card */}
        <div className="space-y-4">
          <div className="glass-panel p-6 border-emerald-500/30 shadow-lg shadow-emerald-500/5 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Hasil Estimasi Tahanan Tanah
            </span>

            {/* Primary Result Display */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Tahanan Pentanahan Terhitung (Rg)
              </span>
              <div className="flex items-baseline justify-center gap-1.5 my-1">
                <span className={`text-5xl font-black tracking-tight font-mono ${
                  calculation.isCompliant ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {calculation.totalR}
                </span>
                <span className="text-2xl font-bold text-slate-400 font-mono">&Omega;</span>
              </div>

              <div className="mt-3">
                <span className={`badge ${
                  calculation.isExcellent
                    ? 'badge-success'
                    : calculation.isCompliant
                    ? 'badge-success'
                    : 'badge-danger'
                }`}>
                  {calculation.isExcellent 
                    ? 'Sangat Baik (≤ 2 Ω - Aman Elektronik)' 
                    : calculation.isCompliant 
                    ? 'Memenuhi Syarat PUIL (≤ 5 Ω)' 
                    : 'Tidak Memenuhi Syarat (> 5 Ω)'}
                </span>
              </div>
            </div>

            {/* Status Breakdown & Recommendations */}
            {!calculation.isCompliant ? (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Nilai Tahanan Masih Melebihi Batas 5 Ohm!</span>
                </div>
                <p>
                  Karena tanah beresistivitas tinggi ({calculation.rho} &Omega;&middot;m), 1 batang elektroda menghasilkan {calculation.singleRodR} &Omega;.
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-red-500/20 text-slate-300 font-medium">
                  💡 <strong>Solusi PUIL:</strong> Tambah elektroda menjadi minimal <strong>{calculation.rodsNeededFor5Ohm} batang paralel</strong> atau tambahkan bubuk bentonit / semen konduktif di sekitar pasak tanah.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instalasi Pembumian Sesuai Standar PUIL</span>
                </div>
                <p>
                  Sistem pembumian ini mampu menyalurkan arus bocor dan proteksi sentuh tidak langsung dengan aman ke dalam bumi.
                </p>
              </div>
            )}

            {/* Quick Grounding Rules Box */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-bold text-white block">Ketentuan Penghantar Pembumian (PUIL 542):</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Kabel arde ke elektroda minimal <strong>6 mm² tembaga</strong> tanpa sambungan rapuh.</li>
                <li>Dilarang menggunakan pipa air PAM logam sebagai satu-satunya elektroda bumi.</li>
                <li>Titik sambungan elektroda wajib diberi bak kontrol (inspection pit) untuk pengetesan berkala.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
