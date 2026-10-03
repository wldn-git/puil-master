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

      {/* Visual Single Line Diagram (SLD) - Standar Gambar 510.5-2 PUIL 2011 / 5100.5-2 PUIL 2020 */}
      <div className="win10-card space-y-4">
        <div className="win10-card-header">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-bold">
              Diagram Skematik Garis Tunggal (SLD) Sirkit Kelompok Motor
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Representasi Resmi Gambar 510.5-2 PUIL
          </span>
        </div>

        {/* Petunjuk Cepat */}
        <div className="p-3 rounded bg-sky-500/10 border border-sky-500/30 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Cara Membaca Skematik:</strong> Arus mengalir dari <strong>Sumber Listrik 3-Fasa</strong> di atas melalui <strong>Kabel & GPHP Feeder</strong> menuju <strong>Rel Busbar PHB (Tembaga)</strong>. Dari busbar, arus didistribusikan ke masing-masing <strong>Sirkit Cabang Motor</strong> secara paralel yang masing-masing dilindungi oleh <strong>MCB (Hubung Pendek)</strong>, <strong>Kabel KHA 125%</strong>, dan <strong>TOR (Beban Lebih)</strong> sebelum masuk ke motor listrik.
          </div>
        </div>

        {/* SVG Interactive Single Line Diagram */}
        {(() => {
          const branchCount = calculation.motorResults.length;
          const colWidth = 240;
          const marginX = 50;
          const svgWidth = Math.max(760, marginX * 2 + branchCount * colWidth);
          const svgHeight = 490;
          const feederX = svgWidth / 2;
          const busbarX1 = marginX + 20;
          const busbarX2 = svgWidth - marginX - 20;

          return (
            <div 
              className="w-full overflow-x-auto p-4 rounded"
              style={{ backgroundColor: 'var(--win-surface-alt)', border: '1px solid var(--win-border)' }}
            >
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full min-w-[720px] h-auto font-sans select-none"
              >
                {/* ================= 1. SALURAN MASUK (FEEDER) ================= */}
                {/* Sumber 3-Fasa Tag */}
                <rect x={feederX - 110} y="15" width="220" height="28" rx="4" fill="#0284c7" />
                <text x={feederX} y="33" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
                  SUMBER DAYA 3-FASA (400V)
                </text>

                {/* Wire from source to Feeder Breaker */}
                <line x1={feederX} y1="43" x2={feederX} y2="58" stroke="var(--win-text)" strokeWidth="2.5" />

                {/* GPHP Feeder Breaker (MCCB) */}
                <rect x={feederX - 125} y="58" width="250" height="34" rx="4" fill="var(--win-surface)" stroke="#b45309" strokeWidth="2" />
                <rect x={feederX - 125} y="58" width="250" height="15" fill="#b45309" />
                <text x={feederX} y="69" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="800">
                  GPHP FEEDER (PENGAMAN HUBUNG PENDEK)
                </text>
                <text x={feederX} y="85" textAnchor="middle" fill="var(--win-text)" fontSize="11" fontWeight="800">
                  MCCB {calculation.recommendedFeederBreaker} Ampere
                </text>

                {/* Wire from Breaker to Feeder Cable */}
                <line x1={feederX} y1="92" x2={feederX} y2="105" stroke="var(--win-text)" strokeWidth="2.5" />

                {/* Kabel Feeder Pill */}
                <rect x={feederX - 145} y="105" width="290" height="22" rx="3" fill="#059669" stroke="#047857" strokeWidth="1" />
                <text x={feederX} y="120" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                  Kabel Feeder: KHA ≥ {calculation.khaFeeder}A ({calculation.feederCableRecommendation})
                </text>

                {/* Wire into Busbar */}
                <line x1={feederX} y1="127" x2={feederX} y2="140" stroke="var(--win-text)" strokeWidth="3" />

                {/* ================= 2. REL PEMBAGI / BUSBAR (TEMBAGA) ================= */}
                {/* Thick Copper Busbar */}
                <rect x={busbarX1} y="137" width={busbarX2 - busbarX1} height="8" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
                <text x={busbarX1 + 10} y="132" fill="var(--win-text)" fontSize="10" fontWeight="800">
                  REL PEMBAGI / BUSBAR PHB MOTOR (R - S - T)
                </text>
                {/* Node for Feeder entry */}
                <circle cx={feederX} cy="141" r="5" fill="#78350f" />

                {/* ================= 3. SIRKIT CABANG TIAP MOTOR ================= */}
                {calculation.motorResults.map((motor, i) => {
                  const colCenter = marginX + i * colWidth + colWidth / 2;
                  const isHighest = calculation.maxMotor && calculation.maxMotor.id === motor.id;

                  return (
                    <g key={motor.id}>
                      {/* Junction Node on Busbar */}
                      <circle cx={colCenter} cy="141" r="4.5" fill="#78350f" />

                      {/* Drop line from busbar to Cabang Header */}
                      <line x1={colCenter} y1="145" x2={colCenter} y2="162" stroke="var(--win-text)" strokeWidth="2.5" />

                      {/* Cabang Header Tag */}
                      <rect 
                        x={colCenter - 65} 
                        y="162" 
                        width="130" 
                        height="22" 
                        rx="3" 
                        fill={isHighest ? '#d97706' : 'var(--win-surface)'} 
                        stroke={isHighest ? '#92400e' : 'var(--win-border)'} 
                        strokeWidth="1.5" 
                      />
                      <text 
                        x={colCenter} 
                        y="177" 
                        textAnchor="middle" 
                        fill={isHighest ? '#ffffff' : 'var(--win-text)'} 
                        fontSize="10" 
                        fontWeight="800"
                      >
                        CABANG {i + 1} {isHighest ? '★ TERBESAR' : ''}
                      </text>

                      {/* Wire to GPHP Breaker */}
                      <line x1={colCenter} y1="184" x2={colCenter} y2="200" stroke="var(--win-text)" strokeWidth="2.5" />

                      {/* Level 1: GPHP Sirkit Akhir (MCB) */}
                      <rect x={colCenter - 85} y="200" width="170" height="34" rx="4" fill="var(--win-surface)" stroke="#0284c7" strokeWidth="1.8" />
                      <rect x={colCenter - 85} y="200" width="170" height="14" fill="#0284c7" />
                      <text x={colCenter} y="210" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="800">
                        1. GPHP SIRKIT AKHIR
                      </text>
                      <text x={colCenter} y="226" textAnchor="middle" fill="var(--win-text)" fontSize="11" fontWeight="800">
                        MCB {motor.recommendedGphpBreaker} A
                      </text>
                      <text x={colCenter} y="240" textAnchor="middle" fill="var(--win-text-secondary)" fontSize="8">
                        Faktor {motor.startMethod.factor * 100}% × In ({motor.maxGphp}A)
                      </text>

                      {/* Wire to Cable */}
                      <line x1={colCenter} y1="234" x2={colCenter} y2="252" stroke="var(--win-text)" strokeWidth="2.5" />

                      {/* Level 2: Penghantar Kabel Sirkit Akhir (125% In) */}
                      <rect x={colCenter - 85} y="252" width="170" height="34" rx="4" fill="var(--win-surface)" stroke="#059669" strokeWidth="1.8" />
                      <rect x={colCenter - 85} y="252" width="170" height="14" fill="#059669" />
                      <text x={colCenter} y="262" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="800">
                        2. KABEL PENGHANTAR (KHA)
                      </text>
                      <text x={colCenter} y="278" textAnchor="middle" fill="var(--win-text)" fontSize="11" fontWeight="800">
                        KHA ≥ {motor.khaBranch} A
                      </text>
                      <text x={colCenter} y="292" textAnchor="middle" fill="var(--win-text-secondary)" fontSize="8">
                        Kabel: {motor.cableRecommendation}
                      </text>

                      {/* Wire to Overload TOR */}
                      <line x1={colCenter} y1="286" x2={colCenter} y2="306" stroke="var(--win-text)" strokeWidth="2.5" />

                      {/* Level 3: Proteksi Beban Lebih (TOR) */}
                      <rect x={colCenter - 85} y="306" width="170" height="34" rx="4" fill="var(--win-surface)" stroke="#b45309" strokeWidth="1.8" />
                      <rect x={colCenter - 85} y="306" width="170" height="14" fill="#b45309" />
                      <text x={colCenter} y="316" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="800">
                        3. BEBAN LEBIH (TOR)
                      </text>
                      <text x={colCenter} y="332" textAnchor="middle" fill="var(--win-text)" fontSize="11" fontWeight="800">
                        Setelan: {motor.torSetting} A
                      </text>
                      <text x={colCenter} y="346" textAnchor="middle" fill="var(--win-text-secondary)" fontSize="8">
                        {Math.round(torFactor * 100)}% × In (Proteksi Termal)
                      </text>

                      {/* Wire to Motor Unit */}
                      <line x1={colCenter} y1="340" x2={colCenter} y2="362" stroke="var(--win-text)" strokeWidth="2.5" />

                      {/* Level 4: Motor Listrik & Grounding */}
                      <rect 
                        x={colCenter - 95} 
                        y="362" 
                        width="190" 
                        height="98" 
                        rx="6" 
                        fill="var(--win-surface)" 
                        stroke={isHighest ? '#d97706' : 'var(--win-border)'} 
                        strokeWidth={isHighest ? 2 : 1.5} 
                      />

                      {/* Motor Circle Symbol */}
                      <circle cx={colCenter - 52} cy="411" r="26" fill="var(--win-surface-alt)" stroke="#0284c7" strokeWidth="2.5" />
                      <text x={colCenter - 52} y="407" textAnchor="middle" fill="var(--win-text)" fontSize="14" fontWeight="900">
                        M
                      </text>
                      <text x={colCenter - 52} y="423" textAnchor="middle" fill="var(--win-text)" fontSize="9" fontWeight="800">
                        3 ~
                      </text>

                      {/* Motor Details */}
                      <text x={colCenter - 14} y="384" fill="var(--win-text)" fontSize="11" fontWeight="800">
                        {motor.name}
                      </text>
                      <text x={colCenter - 14} y="402" fill="var(--win-accent)" fontSize="11" fontWeight="800">
                        In = {motor.In} A
                      </text>
                      <text x={colCenter - 14} y="418" fill="var(--win-text-secondary)" fontSize="9" fontWeight="600">
                        {motor.typeDesc}
                      </text>
                      <text x={colCenter - 14} y="432" fill="var(--win-text-muted)" fontSize="8" fontWeight="500">
                        {motor.startMethod.name.split('-')[1] || motor.startMethod.name}
                      </text>

                      {/* Chassis Grounding Terminal (PE) */}
                      <line x1={colCenter + 75} y1="411" x2={colCenter + 75} y2="437" stroke="#107c10" strokeWidth="2" />
                      <line x1={colCenter + 68} y1="437" x2={colCenter + 82} y2="437" stroke="#107c10" strokeWidth="2" />
                      <line x1={colCenter + 71} y1="441" x2={colCenter + 79} y2="441" stroke="#107c10" strokeWidth="1.5" />
                      <text x={colCenter + 75} y="451" textAnchor="middle" fill="var(--win-success-text)" fontSize="7" fontWeight="800">
                        PE
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })()}

        {/* Penjelasan 4 Tahap Urutan Proteksi Sesuai PUIL Gambar 510.5-2 */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Penjelasan Struktur & Cara Menghitung Tiap Elemen (Gambar 510.5-2):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Feeder */}
            <div className="p-3 rounded win10-card space-y-1">
              <span className="font-bold text-sky-500 block">⚡ Saluran Pengisi (Feeder)</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Menghantarkan total arus seluruh motor. Rumus KHA:
                <br />
                <code className="text-[10px] text-sky-400 font-mono font-bold">
                  KHA = (125% × In_maks) + Σ In_lain
                </code>
                <br />
                Hanya motor terbesar yang dikalikan 125%, motor lainnya dijumlahkan biasa.
              </p>
            </div>

            {/* GPHP Cabang */}
            <div className="p-3 rounded win10-card space-y-1">
              <span className="font-bold text-blue-500 block">🛡️ 1. GPHP Sirkit Akhir</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pengaman hubung pendek (MCB/Sekring). Nilai pengenal disetel tinggi (150% - 250% In) agar tidak langsung *trip* saat motor mengalami lonjakan arus start yang besar.
              </p>
            </div>

            {/* Kabel KHA */}
            <div className="p-3 rounded win10-card space-y-1">
              <span className="font-bold text-emerald-500 block">🔌 2. Kabel Sirkit Akhir</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Wajib memiliki KHA minimal <strong>125% dari In motor</strong> (PUIL 510.5.2) agar penghantar tidak leleh atau panas saat motor bekerja terus-menerus pada beban penuh.
              </p>
            </div>

            {/* TOR */}
            <div className="p-3 rounded win10-card space-y-1">
              <span className="font-bold text-amber-500 block">🔥 3. Proteksi Beban Lebih (TOR)</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Thermal Overload Relay melindungi motor dari panas berlebih jika terjadi macet mekanik. Disetel pada <strong>115% - 125% In</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Ringkasan Komparasi Perhitungan Angka Nyata */}
        <div className="overflow-x-auto pt-2">
          <table className="win10-table w-full text-xs">
            <thead>
              <tr>
                <th>Titik Sirkit</th>
                <th>Komponen</th>
                <th>Rumus Perhitungan PUIL</th>
                <th>Hasil Hitung</th>
                <th>Alat / Kabel Terpilih</th>
              </tr>
            </thead>
            <tbody>
              {/* Feeder Row */}
              <tr style={{ backgroundColor: 'var(--win-accent-bg)' }}>
                <td className="font-bold text-sky-500 font-mono">SALURAN UTAMA (FEEDER)</td>
                <td>Kabel & GPHP Pengisi</td>
                <td className="font-mono text-[11px]">
                  KHA = (1.25 × {calculation.maxMotor?.In || 0}) + {calculation.sumOtherIn || 0} A
                </td>
                <td className="font-mono font-bold">{calculation.khaFeeder} A</td>
                <td className="font-bold">
                  MCCB {calculation.recommendedFeederBreaker}A & Kabel {calculation.feederCableRecommendation}
                </td>
              </tr>
              {/* Each Branch Row */}
              {calculation.motorResults.map((motor, idx) => (
                <tr key={motor.id}>
                  <td className="font-mono font-bold">
                    CABANG {idx + 1} ({motor.name})
                    {calculation.maxMotor && calculation.maxMotor.id === motor.id && (
                      <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">
                        Beban Terbesar
                      </span>
                    )}
                  </td>
                  <td>Sirkit Akhir Motor</td>
                  <td className="font-mono text-[11px]">
                    KHA: 125% × {motor.In}A | GPHP: {motor.startMethod.factor * 100}% × {motor.In}A
                  </td>
                  <td className="font-mono">
                    KHA: {motor.khaBranch}A | TOR: {motor.torSetting}A
                  </td>
                  <td className="font-semibold">
                    MCB {motor.recommendedGphpBreaker}A • {motor.cableRecommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
