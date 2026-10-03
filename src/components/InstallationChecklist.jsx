import React, { useState, useMemo } from 'react';
import { INSPECTION_CHECKLIST } from '../data/puilData';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Printer, 
  ShieldAlert,
  Award
} from 'lucide-react';

export default function InstallationChecklist() {
  // Store checked item IDs in state
  const [checkedItems, setCheckedItems] = useState({
    phb_1: true,
    phb_2: true,
    phb_4: true,
    cable_1: true,
    cable_2: true,
    cable_4: true,
    outlet_1: true,
    ground_1: true,
    ground_2: true,
    ground_3: true,
  });

  const [projectTitle, setProjectTitle] = useState('Instalasi Rumah Tinggal & Toko');
  const [inspectorName, setInspectorName] = useState('Teknisi Listrik Bersertifikat');

  const toggleItem = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReset = () => {
    setCheckedItems({});
  };

  const handleSelectAll = () => {
    const all = {};
    INSPECTION_CHECKLIST.forEach(cat => {
      cat.items.forEach(item => {
        all[item.id] = true;
      });
    });
    setCheckedItems(all);
  };

  // Calculations
  const stats = useMemo(() => {
    let totalItems = 0;
    let checkedCount = 0;
    let criticalTotal = 0;
    let criticalPassed = 0;

    INSPECTION_CHECKLIST.forEach(cat => {
      cat.items.forEach(item => {
        totalItems++;
        if (checkedItems[item.id]) checkedCount++;
        if (item.critical) {
          criticalTotal++;
          if (checkedItems[item.id]) criticalPassed++;
        }
      });
    });

    const score = Math.round((checkedCount / totalItems) * 100);
    const criticalScore = Math.round((criticalPassed / criticalTotal) * 100);
    const isLaikOperasi = score >= 80 && criticalPassed === criticalTotal;

    return {
      totalItems,
      checkedCount,
      score,
      criticalTotal,
      criticalPassed,
      criticalScore,
      isLaikOperasi
    };
  }, [checkedItems]);

  return (
    <div className="space-y-6">

      {/* Intro Header */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ClipboardCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Checklist Kepatuhan & Audit PUIL</h2>
            </div>
            <p className="text-sm text-slate-400">
              Formulir inspeksi mandiri kelaikan instalasi listrik sesuai standar keselamatan PUIL & Sertifikat Laik Operasi (SLO).
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Centang Semua
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary text-xs py-1.5 px-3 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Audit Score Card */}
      <div className="glass-panel p-6 border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Score Ring */}
        <div className="text-center md:border-r md:border-slate-800 pr-4">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Skor Kepatuhan PUIL</span>
          <div className="flex items-baseline justify-center gap-1 font-mono">
            <span className={`text-5xl font-black ${
              stats.score >= 80 ? 'text-emerald-400' : stats.score >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {stats.score}%
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {stats.checkedCount} dari {stats.totalItems} butir terverifikasi
          </span>
        </div>

        {/* Critical Safety Status */}
        <div className="text-center md:border-r md:border-slate-800 pr-4">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Syarat Kritis Keselamatan</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {stats.criticalPassed} / {stats.criticalTotal}
          </div>
          <span className={`badge mt-2 ${
            stats.criticalPassed === stats.criticalTotal ? 'badge-success' : 'badge-danger'
          }`}>
            {stats.criticalPassed === stats.criticalTotal ? '100% Syarat Kritis Lulus' : 'Ada Syarat Kritis Belum Terpenuhi'}
          </span>
        </div>

        {/* Final Audit Verdict */}
        <div className="text-center">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Status Kelaikan</span>
          <div className="mt-1">
            {stats.isLaikOperasi ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                <Award className="w-5 h-5 text-emerald-400" />
                MEMENUHI SYARAT (LAIK)
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                PERLU PERBAIKAN
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Berdasarkan kaidah PUIL 2011/2020 Bagian 6 (Verifikasi)
          </span>
        </div>

      </div>

      {/* Checklist Sections */}
      <div className="space-y-5">
        {INSPECTION_CHECKLIST.map((section, sIdx) => (
          <div key={sIdx} className="glass-panel p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-800">
              <span>{section.category}</span>
              <span className="text-xs font-mono text-slate-400 lowercase">
                {section.items.filter(i => checkedItems[i.id]).length}/{section.items.length} selesai
              </span>
            </h3>

            <div className="space-y-3">
              {section.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-slate-900/90 border-slate-700/80 text-white'
                        : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by parent onClick
                      className="mt-1 w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />

                    <div className="flex-1 text-xs leading-relaxed">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                        {item.critical && (
                          <span className="badge badge-warning text-[9px] px-1.5 py-0">
                            Wajib PUIL
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
