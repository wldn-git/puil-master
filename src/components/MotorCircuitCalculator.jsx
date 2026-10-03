import React, { useState, useMemo } from 'react';
import { 
  RotateCw, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Shield, 
  Zap, 
  SlidersHorizontal,
  Info,
  BookOpen,
  ArrowRight
} from 'lucide-react';

// Metode Pengasutan & Faktor GPHP berdasarkan Tabel 510.5-2 PUIL 2011 / Tabel 5100.5-2 PUIL 2020
const STARTING_METHODS = [
  { id: 'STAR_DELTA', name: 'Motor Sangkar - Asut Bintang-Delta (Y-Δ)', factor: 2.0, defaultFactorDesc: '200% In (Tabel 510.5-2)' },
  { id: 'DOL', name: 'Motor Sangkar - Asut Langsung (DOL)', factor: 2.5, defaultFactorDesc: '250% In (Tabel 510.5-2)' },
  { id: 'AUTOTRAFO', name: 'Motor Serempak - Asut Autotrafo', factor: 2.0, defaultFactorDesc: '200% In (Tabel 510.5-2)' },
  { id: 'WOUND_ROTOR', name: 'Motor Rotor Lilit (Slip Ring)', factor: 1.5, defaultFactorDesc: '150% In (Tabel 510.5-2)' },
  { id: 'SOFT_STARTER', name: 'Motor dengan Soft Starter / VFD', factor: 1.25, defaultFactorDesc: '125% In (Inverter)' },
];

// Standar Nilai Pengenal Breaker / Pengaman (Ampere)
const STANDARD_BREAKER_RATINGS = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 225, 250, 300, 350, 400, 500, 630, 800, 1000
];

// Tabel Estimasi KHA Kabel Tembaga Cu PVC 3-Fasa (Metode B1/C)
const COPPER_CABLE_KHA = [
  { size: 1.5, kha: 18 },
  { size: 2.5, kha: 24 },
  { size: 4, kha: 32 },
  { size: 6, kha: 41 },
  { size: 10, kha: 57 },
  { size: 16, kha: 76 },
  { size: 25, kha: 101 },
  { size: 35, kha: 125 },
  { size: 50, kha: 151 },
  { size: 70, kha: 192 },
  { size: 95, kha: 232 },
  { size: 120, kha: 269 },
  { size: 150, kha: 300 },
  { size: 185, kha: 341 },
  { size: 240, kha: 400 },
  { size: 300, kha: 450 },
];

function getCableSize(requiredKha) {
  const match = COPPER_CABLE_KHA.find(c => c.kha >= requiredKha);
  return match ? `${match.size} mm² (KHA ${match.kha}A)` : '≥ 300 mm² (Paralel)';
}

function getClosestBreaker(maxCalculatedCurrent) {
  // PUIL: Nilai pengenal tidak boleh melebihi nilai perhitungan, jadi ambil rating standar terdekat <= atau pas
  const valid = STANDARD_BREAKER_RATINGS.filter(r => r <= maxCalculatedCurrent);
  if (valid.length > 0) {
    return valid[valid.length - 1];
  }
  return STANDARD_BREAKER_RATINGS[0];
}

// Data awal persis contoh Gambar 510.5-2 PUIL 2011 / Gambar 5100.5-2 PUIL 2020
const INITIAL_PUIL_CASE = [
  {
    id: 1,
    name: 'Motor 1 (M1)',
    typeDesc: 'Motor Sangkar',
    startingMethodId: 'STAR_DELTA',
    current: 42, // 42 A
  },
  {
    id: 2,
    name: 'Motor 2 (M2)',
    typeDesc: 'Motor Serempak',
    startingMethodId: 'AUTOTRAFO',
    current: 54, // 54 A
  },
  {
    id: 3,
    name: 'Motor 3 (M3)',
    typeDesc: 'Motor Rotor Lilit',
    startingMethodId: 'WOUND_ROTOR',
    current: 68, // 68 A (Terbesar)
  },
];

export default function MotorCircuitCalculator() {
  const [motors, setMotors] = useState(INITIAL_PUIL_CASE);
  const [torFactor, setTorFactor] = useState(1.15); // 115% default TOR

  // Reset ke contoh resmi Gambar 510.5-2 PUIL
  const handleResetToStandardCase = () => {
    setMotors(INITIAL_PUIL_CASE);
    setTorFactor(1.15);
  };

  // Tambah Motor Baru
  const handleAddMotor = () => {
    const newId = motors.length > 0 ? Math.max(...motors.map(m => m.id)) + 1 : 1;
    setMotors([
      ...motors,
      {
        id: newId,
        name: `Motor ${newId} (M${newId})`,
        typeDesc: 'Motor Sangkar',
        startingMethodId: 'STAR_DELTA',
        current: 30,
      }
    ]);
  };

  // Hapus Motor
  const handleRemoveMotor = (id) => {
    if (motors.length <= 1) return;
    setMotors(motors.filter(m => m.id !== id));
  };

  // Update Data Motor
  const handleUpdateMotor = (id, field, value) => {
    setMotors(motors.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    }));
  };

  // Kalkulasi PUIL
  const calculation = useMemo(() => {
    // 1. Perhitungan tiap motor
    const motorResults = motors.map(motor => {
      const In = Number(motor.current) || 0;
      const startMethod = STARTING_METHODS.find(s => s.id === motor.startingMethodId) || STARTING_METHODS[0];
      
      // KHA Sirkit Akhir = 125% x In (PUIL 510.5.2)
      const khaBranch = 1.25 * In;

      // Proteksi Beban Lebih (TOR) = 115% x In (atau 125% jika motor khusus)
      const torSetting = torFactor * In;

      // Proteksi Hubung Pendek (GPHP) = Faktor x In
      const maxGphp = startMethod.factor * In;
      const recommendedGphpBreaker = getClosestBreaker(maxGphp);

      return {
        ...motor,
        In,
        startMethod,
        khaBranch: khaBranch.toFixed(1),
        cableRecommendation: getCableSize(khaBranch),
        torSetting: torSetting.toFixed(1),
        maxGphp: maxGphp.toFixed(1),
        recommendedGphpBreaker
      };
    });

    // 2. Identifikasi motor terbesar berdasarkan Arus Nominal (In)
    let maxMotor = motorResults[0] || null;
    motorResults.forEach(m => {
      if (m.In > (maxMotor ? maxMotor.In : 0)) {
        maxMotor = m;
      }
    });

    const otherMotors = motorResults.filter(m => m.id !== (maxMotor ? maxMotor.id : -1));
    const sumOtherIn = otherMotors.reduce((acc, m) => acc + m.In, 0);

    // 3. KHA Feeder Saluran Utama (PUIL 510.5.3)
    // KHA = 125% x In_terbesar + sum(In_lainnya)
    const maxMotor125 = maxMotor ? 1.25 * maxMotor.In : 0;
    const khaFeeder = maxMotor125 + sumOtherIn;
    const feederCableRecommendation = getCableSize(khaFeeder);

    // 4. GPHP Feeder Saluran Utama (PUIL 510.5.6)
    // GPHP_feeder <= GPHP_motor_terbesar + sum(In_lainnya)
    // Diambil dari motor yang menghasilkan GPHP terbesar
    let maxMotorForGphp = motorResults[0] || null;
    motorResults.forEach(m => {
      if (Number(m.maxGphp) > (maxMotorForGphp ? Number(maxMotorForGphp.maxGphp) : 0)) {
        maxMotorForGphp = m;
      }
    });

    const otherMotorsForGphp = motorResults.filter(m => m.id !== (maxMotorForGphp ? maxMotorForGphp.id : -1));
    const sumOtherInForGphp = otherMotorsForGphp.reduce((acc, m) => acc + m.In, 0);
    const maxFeederGphpAllowed = (maxMotorForGphp ? Number(maxMotorForGphp.maxGphp) : 0) + sumOtherInForGphp;
    const recommendedFeederBreaker = getClosestBreaker(maxFeederGphpAllowed);

    return {
      motorResults,
      maxMotor,
      sumOtherIn,
      khaFeeder: khaFeeder.toFixed(1),
      feederCableRecommendation,
      maxMotorForGphp,
      maxFeederGphpAllowed: maxFeederGphpAllowed.toFixed(1),
      recommendedFeederBreaker
    };
  }, [motors, torFactor]);

  return (
    <div className="space-y-5">

      {/* Intro Header */}
      <div className="win10-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <RotateCw className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-white">
                Kalkulator Sirkit Motor Listrik (PUIL 2011 Gambar 510.5-2 / PUIL 2020 Gambar 5100.5-2)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Perhitungan KHA kabel saluran cabang (*feeder*), kabel sirkit akhir, serta koordinasi gawai proteksi arus lebih (TOR) & hubung pendek (GPHP).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToStandardCase}
              className="win10-btn"
              title="Kembalikan ke angka resmi contoh Gambar 510.5-2 PUIL (42A, 54A, 68A)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Muat Kasus Standar PUIL
            </button>
            <button
              onClick={handleAddMotor}
              className="win10-btn win10-btn-primary"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Motor
            </button>
          </div>
        </div>
      </div>

      {/* Hero Feeder Summary Tile */}
      <div className="win10-card border-l-4 border-l-amber-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Main Calculation Metric */}
          <div className="space-y-1">
            <span className="win10-badge win10-badge-accent text-[10px] font-bold">
              HASIL PERHITUNGAN SIRKIT CABANG (FEEDER)
            </span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl font-black font-mono text-amber-400">
                {calculation.khaFeeder}
              </span>
              <span className="text-lg font-bold font-mono text-slate-300">Amper</span>
            </div>
            <p className="text-xs text-slate-400">
              Kuat Hantar Arus (KHA) Minimal Penghantar Saluran Utama
            </p>
          </div>

          {/* Formula Breakdown Callout */}
          <div className="p-3 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1 font-mono">
            <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wider">
              Rumus PUIL 510.5.3:
            </span>
            <div className="text-sky-300">
              KHA = (125% × In_maks) + Σ In_lainnya
            </div>
            <div className="text-slate-300 pt-0.5">
              = (1.25 × {calculation.maxMotor?.In || 0} A) + {calculation.sumOtherIn} A
            </div>
            <div className="text-amber-400 font-bold pt-0.5">
              = {calculation.maxMotor ? (1.25 * calculation.maxMotor.In).toFixed(1) : 0} A + {calculation.sumOtherIn} A = {calculation.khaFeeder} A
            </div>
          </div>

          {/* Breaker & Cable Recommendations */}
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Rekomendasi Kabel Feeder:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {calculation.feederCableRecommendation}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">GPHP Feeder (Maks. {calculation.maxFeederGphpAllowed}A):</span>
              <span className="font-bold text-amber-400 font-mono">
                MCCB {calculation.recommendedBreaker || calculation.recommendedFeederBreaker} A
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid List of Individual Motors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Parameter Sirkit Akhir Setiap Motor ({motors.length} Unit)
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Setelan TOR:</span>
            <select
              value={torFactor}
              onChange={(e) => setTorFactor(Number(e.target.value))}
              className="win10-select py-1 h-7 text-xs font-mono"
            >
              <option value="1.15">115% In (Standar Umum)</option>
              <option value="1.25">125% In (Faktor Servis ≥ 1.15)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {calculation.motorResults.map((motor, index) => {
            const isHighest = calculation.maxMotor && calculation.maxMotor.id === motor.id;
            return (
              <div 
                key={motor.id} 
                className={`win10-card space-y-3 ${isHighest ? 'border-amber-500/60' : ''}`}
              >
                {/* Header Motor */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
                      {index + 1}
                    </span>
                    <span className="font-bold text-white text-xs">{motor.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isHighest && (
                      <span className="win10-badge win10-badge-warning text-[9px] font-bold">
                        Beban Terbesar
                      </span>
                    )}
                    {motors.length > 1 && (
                      <button
                        onClick={() => handleRemoveMotor(motor.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Hapus Motor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="input-label">Arus Beban Penuh (In / FLA)</label>
                    <div className="win10-input-group">
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={motor.current}
                        onChange={(e) => handleUpdateMotor(motor.id, 'current', e.target.value)}
                        className="custom-input font-mono font-bold text-base"
                      />
                      <span className="win10-input-addon">Amper</span>
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Metode Pengasutan (Starting)</label>
                    <select
                      value={motor.startingMethodId}
                      onChange={(e) => handleUpdateMotor(motor.id, 'startingMethodId', e.target.value)}
                      className="custom-select text-xs"
                    >
                      {STARTING_METHODS.map(sm => (
                        <option key={sm.id} value={sm.id}>
                          {sm.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calculation Outputs for this motor */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">KHA Sirkit Akhir (125%):</span>
                    <span className="font-bold text-sky-400">{motor.khaBranch} A</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Setelan TOR ({Math.round(torFactor * 100)}%):</span>
                    <span className="font-bold text-amber-400">{motor.torSetting} A</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">GPHP Maks ({motor.startMethod.factor * 100}%):</span>
                    <span className="font-bold text-emerald-400">{motor.maxGphp} A</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/40">
                    <span className="text-slate-400">Rekomendasi Breaker:</span>
                    <span className="font-bold text-white">MCB {motor.recommendedGphpBreaker} A</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Kabel Tembaga Cu:</span>
                    <span className="text-[11px] font-semibold text-slate-200">{motor.cableRecommendation}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Single Line Diagram (SLD) - Inspired directly by Gambar 510.5-2 */}
      <div className="win10-card space-y-3">
        <div className="win10-card-header">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Diagram Skematik Garis Tunggal Kelompok Motor (Representasi Gambar 510.5-2)
          </span>
          <span className="text-xs font-mono text-slate-400">Feeder & Rangkaian Sirkit Akhir</span>
        </div>

        <div className="overflow-x-auto p-4 bg-slate-950/70 rounded border border-slate-800">
          <div className="min-w-[680px] space-y-4">
            
            {/* Feeder Incoming Section */}
            <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded border border-slate-800">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400 font-bold font-mono text-xs">
                SUMBER 3-FASA
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300">
                GPHP Feeder: <strong>MCCB {calculation.recommendedFeederBreaker}A</strong>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
                Kabel Feeder: <strong>KHA ≥ {calculation.khaFeeder}A</strong> ({calculation.feederCableRecommendation})
              </div>
            </div>

            {/* Horizontal Busbar */}
            <div className="relative py-2">
              <div className="h-2 bg-amber-500/80 rounded w-full"></div>
              <span className="absolute top-0 right-2 text-[10px] font-mono text-amber-300 bg-slate-900 px-1.5 rounded border border-amber-500/30">
                BUSBAR DISTRIBUSI PHB MOTOR
              </span>
            </div>

            {/* 3 Motor Branches */}
            <div className="grid grid-cols-3 gap-3">
              {calculation.motorResults.map((motor, idx) => (
                <div key={motor.id} className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center space-y-2 text-xs">
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    Cabang {idx + 1}
                  </div>
                  
                  {/* Branch Breaker */}
                  <div className="p-1.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-white">
                    GPHP: <strong>MCB {motor.recommendedGphpBreaker}A</strong>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 mx-auto rotate-90" />

                  {/* Overload TOR */}
                  <div className="p-1.5 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] font-mono text-amber-300">
                    TOR: <strong>{motor.torSetting} A</strong>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 mx-auto rotate-90" />

                  {/* Cable */}
                  <div className="p-1.5 rounded bg-slate-800/80 text-[10px] font-mono text-emerald-400">
                    KHA ≥ {motor.khaBranch}A
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 mx-auto rotate-90" />

                  {/* Motor Unit */}
                  <div className="p-2.5 rounded bg-sky-950/30 border border-sky-500/40 text-center">
                    <span className="font-bold text-sky-400 block text-xs">{motor.name}</span>
                    <span className="text-[11px] font-mono text-white block mt-0.5">In = {motor.In} A</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{motor.startMethod.name}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Theory & PUIL Article Reference Card */}
      <div className="win10-card space-y-3">
        <div className="win10-card-header">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Kaidah Hukum & Pasal PUIL 2011 / PUIL 2020 untuk Sirkit Motor
          </span>
          <span className="text-xs font-mono text-slate-400">SNI 0225:2020</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed text-slate-300">
          <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-sky-400 block">1. KHA Sirkit Akhir (Pasal 510.5.2):</span>
            <p>
              Penghantar sirkit akhir yang menyuplai motor tunggal wajib memiliki KHA tidak kurang dari <strong>125% dari arus pengenal beban penuh (In)</strong> motor untuk mengantisipasi panas akibat beban kontinu dan lonjakan start.
            </p>
          </div>

          <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block">2. KHA Sirkit Cabang Feeder (Pasal 510.5.3):</span>
            <p>
              Kabel feeder utama yang menyuplai sekelompok motor dihitung dengan rumus: 
              <br />
              <strong className="text-white font-mono">KHA = (125% × In_terbesar) + Σ In_lainnya</strong>.
              Hanya motor terbesar yang dikalikan faktor 125%, sedangkan motor lainnya dihitung pada arus nominal.
            </p>
          </div>

          <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">3. Proteksi Hubung Pendek Feeder (Pasal 510.5.6):</span>
            <p>
              Rating pengenal GPHP feeder tidak boleh melebihi setelan GPHP motor yang menghasilkan nilai proteksi terbesar ditambah jumlah arus nominal ($I_n$) motor lainnya:
              <br />
              <strong className="text-white font-mono">GPHP ≤ GPHP_terbesar + Σ In_lainnya</strong>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
