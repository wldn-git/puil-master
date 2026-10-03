import React, { useState, useMemo } from 'react';
import {
  CABLE_CROSS_SECTIONS,
  STANDARD_MCB_RATINGS,
  KHA_TABLE_COPPER_PVC,
  TEMP_CORRECTION_FACTORS,
  GROUPING_FACTORS
} from '../data/puilData';
import { 
  Zap, 
  Layers, 
  Thermometer, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Cpu,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function CableCalculator() {
  // Input states
  const [phase, setPhase] = useState('1'); // '1' or '3'
  const [voltage, setVoltage] = useState(220); // 220V for 1-ph, 380V for 3-ph
  const [loadType, setLoadType] = useState('WATT'); // 'WATT', 'KVA', 'AMP'
  const [loadValue, setLoadValue] = useState(3500); // default 3500 Watt
  const [cosPhi, setCosPhi] = useState(0.85);
  const [cableLength, setCableLength] = useState(25); // meter
  const [installMethod, setInstallMethod] = useState('B1'); // 'B1', 'C', 'AIR', 'GROUND'
  const [circuitType, setCircuitType] = useState('OUTLET'); // 'LIGHTING' (min 1.5mm2), 'OUTLET' (min 2.5mm2)
  const [ambientTemp, setAmbientTemp] = useState(30); // 30 C
  const [groupingCount, setGroupingCount] = useState(1); // 1 to 6

  // Adjust default voltage when phase changes
  const handlePhaseChange = (newPhase) => {
    setPhase(newPhase);
    if (newPhase === '1') {
      setVoltage(220);
    } else {
      setVoltage(380);
    }
  };

  // Perform Calculations
  const calculation = useMemo(() => {
    const V = Number(voltage) || 220;
    const pf = Math.max(0.5, Math.min(1.0, Number(cosPhi) || 0.85));
    const L = Math.max(1, Number(cableLength) || 1);
    const numLoad = Number(loadValue) || 0;

    // 1. Calculate Design Load Current (Ib)
    let Ib = 0;
    if (loadType === 'AMP') {
      Ib = numLoad;
    } else if (loadType === 'KVA') {
      const VA = numLoad * 1000;
      if (phase === '1') {
        Ib = VA / V;
      } else {
        Ib = VA / (Math.sqrt(3) * V);
      }
    } else {
      // WATT
      const P = numLoad;
      if (phase === '1') {
        Ib = P / (V * pf);
      } else {
        Ib = P / (Math.sqrt(3) * V * pf);
      }
    }

    // 2. Select Recommended MCB Rating (In >= Ib)
    let recommendedMcb = STANDARD_MCB_RATINGS.find(rating => rating >= Ib);
    if (!recommendedMcb) {
      recommendedMcb = STANDARD_MCB_RATINGS[STANDARD_MCB_RATINGS.length - 1];
    }

    // 3. Correction factors
    const tempFactor = TEMP_CORRECTION_FACTORS.PVC[ambientTemp] || 1.0;
    const groupFactor = GROUPING_FACTORS[groupingCount] || 1.0;
    const totalDeratingFactor = tempFactor * groupFactor;

    // Minimum required raw KHA (I_base >= In / totalDeratingFactor)
    const requiredKHA = recommendedMcb / totalDeratingFactor;

    // Determine KHA table key based on installation method and phase
    let khaKey = 'B1_1PHASE';
    if (installMethod === 'B1') {
      khaKey = phase === '1' ? 'B1_1PHASE' : 'B1_3PHASE';
    } else if (installMethod === 'C') {
      khaKey = phase === '1' ? 'C_1PHASE' : 'C_3PHASE';
    } else if (installMethod === 'AIR') {
      khaKey = phase === '1' ? 'AIR_1PHASE' : 'AIR_3PHASE';
    } else if (installMethod === 'GROUND') {
      khaKey = 'GROUND';
    }

    const khaTable = KHA_TABLE_COPPER_PVC[khaKey];

    // Minimum size required by PUIL rules (1.5mm2 for lighting, 2.5mm2 for sockets/power)
    const minPuilSize = circuitType === 'LIGHTING' ? 1.5 : 2.5;

    // 4. Find Cable Cross Section that satisfies KHA
    let selectedSize = CABLE_CROSS_SECTIONS.find(size => {
      if (size < minPuilSize) return false;
      const baseKha = khaTable[size] || 0;
      return baseKha >= requiredKHA;
    });

    if (!selectedSize) {
      selectedSize = CABLE_CROSS_SECTIONS[CABLE_CROSS_SECTIONS.length - 1];
    }

    // 5. Voltage Drop Calculation
    // Copper resistivity rho = 0.0178 Ohm * mm2 / m
    const rhoCu = 0.0178;
    const calculateDrop = (size) => {
      let deltaV = 0;
      if (phase === '1') {
        deltaV = (2 * L * Ib * rhoCu) / size;
      } else {
        deltaV = (Math.sqrt(3) * L * Ib * rhoCu) / size;
      }
      const dropPercent = (deltaV / V) * 100;
      return { deltaV, dropPercent };
    };

    let { deltaV, dropPercent } = calculateDrop(selectedSize);
    let upgradedForDrop = false;
    let initialSizeForKha = selectedSize;

    // If voltage drop > 4% (PUIL limit), evaluate stepping up cable size
    if (dropPercent > 4.0) {
      for (const nextSize of CABLE_CROSS_SECTIONS) {
        if (nextSize > selectedSize) {
          const check = calculateDrop(nextSize);
          if (check.dropPercent <= 4.0) {
            selectedSize = nextSize;
            deltaV = check.deltaV;
            dropPercent = check.dropPercent;
            upgradedForDrop = true;
            break;
          }
        }
      }
    }

    const baseKhaSelected = khaTable[selectedSize] || 0;
    const deratedKhaSelected = baseKhaSelected * totalDeratingFactor;

    return {
      Ib: Ib.toFixed(2),
      recommendedMcb,
      selectedSize,
      initialSizeForKha,
      upgradedForDrop,
      baseKha: baseKhaSelected,
      deratedKha: deratedKhaSelected.toFixed(1),
      deltaV: deltaV.toFixed(2),
      dropPercent: dropPercent.toFixed(2),
      tempFactor,
      groupFactor,
      totalDeratingFactor: totalDeratingFactor.toFixed(2),
      isDropSafe: dropPercent <= 4.0,
      isDropWarning: dropPercent > 4.0 && dropPercent <= 5.0,
      isDropCritical: dropPercent > 5.0,
      minPuilSize
    };
  }, [phase, voltage, loadType, loadValue, cosPhi, cableLength, installMethod, circuitType, ambientTemp, groupingCount]);

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Zap className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Kalkulator KHA Kabel & Penampang Penghantar</h2>
            </div>
            <p className="text-sm text-slate-400">
              Sesuai Tabel 52-C1 PUIL 2011 / 2020 (SNI IEC 60364-5-52) & Batas Susut Tegangan PUIL Bagian 525.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">
              Standar PUIL 2011 / 2020
            </span>
            <span className="badge badge-warning">
              Tembaga (Cu) / PVC
            </span>
          </div>
        </div>
      </div>

      <div className="calc-container">

        {/* Input Parameters Column */}
        <div className="space-y-5">
          <div className="glass-panel p-6 border-slate-800 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
              <Cpu className="w-4 h-4 text-sky-400" />
              Parameter Sirkit Beban
            </h3>

            {/* Phase & Voltage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Sistem Fasa</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePhaseChange('1')}
                    className={`phase-btn ${phase === '1' ? 'active' : ''}`}
                  >
                    1-Fasa (220V)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhaseChange('3')}
                    className={`phase-btn ${phase === '3' ? 'active-amber' : ''}`}
                  >
                    3-Fasa (380V)
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">Tegangan Nominal (Volt)</label>
                <input
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="custom-input font-mono"
                  placeholder="220 atau 380"
                />
              </div>
            </div>

            {/* Load Input & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Besaran Beban</label>
                <div className="win10-input-group">
                  <input
                    type="number"
                    min="1"
                    value={loadValue}
                    onChange={(e) => setLoadValue(e.target.value)}
                    className="custom-input font-mono font-bold"
                  />
                  <select
                    value={loadType}
                    onChange={(e) => setLoadType(e.target.value)}
                    className="win10-input-select-addon"
                  >
                    <option value="WATT">Watt</option>
                    <option value="KVA">kVA</option>
                    <option value="AMP">Amper (A)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Faktor Daya (cos φ)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="1.0"
                  value={cosPhi}
                  onChange={(e) => setCosPhi(e.target.value)}
                  className="custom-input font-mono"
                  disabled={loadType === 'AMP'}
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Default 0.85 (induktif)</span>
              </div>
            </div>

            {/* Cable Length & Circuit Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Panjang Jalur Kabel (Meter)</label>
                <div className="win10-input-group">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={cableLength}
                    onChange={(e) => setCableLength(e.target.value)}
                    className="custom-input font-mono"
                  />
                  <span className="win10-input-addon">meter</span>
                </div>
              </div>

              <div>
                <label className="input-label">Peruntukan Sirkit PUIL</label>
                <select
                  value={circuitType}
                  onChange={(e) => setCircuitType(e.target.value)}
                  className="custom-select"
                >
                  <option value="OUTLET">Stop Kontak / Daya (Min. 2,5 mm²)</option>
                  <option value="LIGHTING">Penerangan / Lampu (Min. 1,5 mm²)</option>
                </select>
              </div>
            </div>

            {/* Installation Method */}
            <div>
              <label className="input-label">Metode Pemasangan Kabel (Tabel 52-C1 PUIL)</label>
              <select
                value={installMethod}
                onChange={(e) => setInstallMethod(e.target.value)}
                className="custom-select"
              >
                <option value="B1">Metode B1: Dalam pipa konduit di dinding (Rumah Tinggal)</option>
                <option value="C">Metode C: Menempel di dinding / permukaan kayu</option>
                <option value="AIR">Metode E/F: Di udara terbuka / nampan kabel berlubang (Tray)</option>
                <option value="GROUND">Metode D: Ditanam langsung di tanah (Direct Buried)</option>
              </select>
            </div>

            {/* Correction Factors Section */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label flex items-center justify-between">
                  <span>Suhu Sekitar</span>
                  <span className="text-amber-400 font-mono text-xs">{ambientTemp}°C (k={calculation.tempFactor})</span>
                </label>
                <select
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(Number(e.target.value))}
                  className="custom-select font-mono text-sm"
                >
                  <option value="25">25°C (Ruang Ber-AC, k = 1.06)</option>
                  <option value="30">30°C (Standar PUIL Indonesia, k = 1.00)</option>
                  <option value="35">35°C (Ruang Tertutup / Plafon, k = 0.94)</option>
                  <option value="40">40°C (Dekat Atap Seng / Pabrik, k = 0.87)</option>
                  <option value="45">45°C (Ruang Mesin / Boiler, k = 0.79)</option>
                  <option value="50">50°C (Suhu Sangat Tinggi, k = 0.71)</option>
                </select>
              </div>

              <div>
                <label className="input-label flex items-center justify-between">
                  <span>Jumlah Sirkit Berdampingan</span>
                  <span className="text-amber-400 font-mono text-xs">{groupingCount} jalur (k={calculation.groupFactor})</span>
                </label>
                <select
                  value={groupingCount}
                  onChange={(e) => setGroupingCount(Number(e.target.value))}
                  className="custom-select font-mono text-sm"
                >
                  <option value="1">1 Kabel Tunggal (k = 1.00)</option>
                  <option value="2">2 Kabel dalam satu pipa/tray (k = 0.80)</option>
                  <option value="3">3 Kabel berkas (k = 0.70)</option>
                  <option value="4">4 Kabel berkas (k = 0.65)</option>
                  <option value="5">5 Kabel berkas (k = 0.60)</option>
                  <option value="6">6 Kabel berkas (k = 0.57)</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Output Results Card */}
        <div className="space-y-5">
          <div className="glass-panel p-6 border-amber-500/30">

            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/20">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Hasil Perhitungan PUIL
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                k-total: {calculation.totalDeratingFactor}
              </span>
            </div>

            {/* Recommended Cable Size Hero */}
            <div className="win10-hero-tile">
              <span className="win10-hero-label">
                Rekomendasi Penampang Kabel
              </span>
              <div className="win10-hero-value">
                <span className="win10-hero-number">
                  {calculation.selectedSize}
                </span>
                <span className="win10-hero-unit">mm²</span>
              </div>
              <div className="win10-hero-badge">
                Jenis Kabel: NYM / NYY (Tembaga Cu)
              </div>

              {calculation.upgradedForDrop && (
                <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-400 flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dinaikkan dari {calculation.initialSizeForKha} mm²:</strong> Penampang diperbesar agar susut tegangan memenuhi syarat PUIL (&le; 4%).
                  </span>
                </div>
              )}
            </div>

            {/* 3 Key Metrics Row: Ib, In, Iz */}
            <div className="win10-metrics-grid">
              <div className="win10-metric-box">
                <span className="win10-metric-label">Arus Beban (Ib)</span>
                <div className="win10-metric-val">{calculation.Ib} <span className="win10-metric-unit">A</span></div>
              </div>
              <div className="win10-metric-box win10-metric-highlight">
                <span className="win10-metric-label" style={{ color: '#d97706' }}>Rating MCB (In)</span>
                <div className="win10-metric-val" style={{ color: '#d97706' }}>{calculation.recommendedMcb} <span className="win10-metric-unit">A</span></div>
              </div>
              <div className="win10-metric-box">
                <span className="win10-metric-label">KHA Izin (Iz)</span>
                <div className="win10-metric-val" style={{ color: 'var(--win-success-text)' }}>{calculation.deratedKha} <span className="win10-metric-unit">A</span></div>
              </div>
            </div>

            {/* PUIL Golden Safety Condition Check */}
            <div className="win10-safety-check">
              <div className="win10-safety-header">
                <span>Kepatuhan Kondisi PUIL:</span>
                <span className="win10-safety-formula">
                  <CheckCircle2 className="w-3.5 h-3.5 inline" />
                  {calculation.Ib} A ≤ {calculation.recommendedMcb} A ≤ {calculation.deratedKha} A
                </span>
              </div>
              <div className="win10-progress-track">
                <div 
                  className="win10-progress-bar"
                  style={{ width: `${Math.min(100, (calculation.Ib / calculation.deratedKha) * 100)}%` }}
                  title="Persentase Beban terhadap KHA Kabel"
                ></div>
              </div>
              <div className="win10-safety-sub">
                <span>0 A</span>
                <span>Margin Aman: {(calculation.deratedKha - calculation.Ib).toFixed(1)} A</span>
                <span>KHA: {calculation.deratedKha} A</span>
              </div>
            </div>

            {/* Voltage Drop Result Card */}
            <div className={`win10-drop-card ${
              calculation.isDropSafe ? 'safe' : calculation.isDropWarning ? 'warning' : 'danger'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-sky-400" />
                  Jatuh Tegangan (Voltage Drop)
                </span>
                <span className={`badge ${
                  calculation.isDropSafe ? 'badge-success' : calculation.isDropWarning ? 'badge-warning' : 'badge-danger'
                }`}>
                  {calculation.isDropSafe ? 'Aman (PUIL ≤ 4%)' : calculation.isDropWarning ? 'Toleransi Maksimal' : 'Kritis (> 5%)'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black font-mono text-white">
                    {calculation.dropPercent}%
                  </span>
                  <span className="text-xs text-slate-400 ml-2 font-mono">
                    (ΔV = {calculation.deltaV} Volt)
                  </span>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono">
                  Batas PUIL: maks 4%
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Single Line Diagram (SLD) Circuit Preview */}
      <div className="glass-panel p-6 border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Diagram Garis Tunggal (SLD) Sirkit Ini
        </h3>

        <div className="sld-flow-container">
          
          {/* Source PLN */}
          <div className="sld-flow-item sld-source">
            <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-1.5">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Sumber PLN</span>
            <span className="text-[11px] font-mono text-slate-400">{phase}-Fasa {voltage}V</span>
          </div>

          <div className="sld-arrow-item">
            <span className="text-[10px] text-slate-400 font-mono mb-1">APP / Meter</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* Protection MCB */}
          <div className="sld-flow-item sld-mcb">
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500 font-bold font-mono mb-1.5">
              {calculation.recommendedMcb}A
            </div>
            <span className="text-xs font-bold text-amber-400">MCB Kurva C</span>
            <span className="text-[11px] font-mono text-slate-400">In = {calculation.recommendedMcb} A</span>
          </div>

          <div className="sld-arrow-item">
            <span className="text-[10px] text-amber-500 font-mono mb-1">{cableLength} m</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* Cable Section */}
          <div className="sld-flow-item sld-cable">
            <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold font-mono mb-1.5">
              {calculation.selectedSize}
            </div>
            <span className="text-xs font-bold text-sky-400">NYM {calculation.selectedSize} mm²</span>
            <span className="text-[11px] font-mono text-slate-400">Iz = {calculation.deratedKha} A</span>
          </div>

          <div className="sld-arrow-item">
            <span className="text-[10px] text-emerald-400 font-mono mb-1">ΔV: {calculation.dropPercent}%</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* Load */}
          <div className="sld-flow-item sld-load">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1.5">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Beban Konsumen</span>
            <span className="text-[11px] font-mono text-slate-400">{loadValue} {loadType} (Ib={calculation.Ib}A)</span>
          </div>

        </div>
      </div>

    </div>
  );
}
