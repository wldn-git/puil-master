import React, { useState, useMemo } from 'react';
import { INSPECTION_CHECKLIST } from '../data/puilData';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Printer, 
  Award
} from 'lucide-react';

export default function InstallationChecklist() {
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
    <div className="space-y-4">

      {/* Intro Header */}
      <div className="win10-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold text-white">Checklist Kepatuhan & Audit PUIL</h2>
            </div>
            <p className="text-xs text-slate-400">
              Formulir inspeksi mandiri kelaikan instalasi listrik sesuai standar keselamatan PUIL & Sertifikat Laik Operasi (SLO).
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="win10-btn text-xs py-1 px-3"
            >
              Centang Semua
            </button>
            <button
              onClick={handleReset}
              className="win10-btn text-xs py-1 px-3"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Audit Score Card */}
      <div className="win10-card grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Score Ring */}
        <div className="text-center md:border-r md:border-slate-800 pr-2">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Skor Kepatuhan PUIL</span>
          <div className="flex items-baseline justify-center gap-1 font-mono">
            <span className={`text-4xl font-black ${
              stats.score >= 80 ? 'text-emerald-400' : stats.score >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {stats.score}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.checkedCount} dari {stats.totalItems} butir terverifikasi
          </span>
        </div>

        {/* Critical Safety Status */}
        <div className="text-center md:border-r md:border-slate-800 pr-2">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Syarat Kritis Keselamatan</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {stats.criticalPassed} / {stats.criticalTotal}
          </div>
          <span className={`win10-badge mt-2 ${
            stats.criticalPassed === stats.criticalTotal ? 'win10-badge-success' : 'win10-badge-danger'
          }`}>
            {stats.criticalPassed === stats.criticalTotal ? '100% Syarat Kritis Lulus' : 'Ada Syarat Kritis Belum Terpenuhi'}
          </span>
        </div>

        {/* Final Audit Verdict */}
        <div className="text-center">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Status Kelaikan</span>
          <div className="mt-1">
            {stats.isLaikOperasi ? (
              <span className="win10-badge win10-badge-success py-1 px-2.5 text-xs font-bold">
                <Award className="w-4 h-4 text-emerald-400" />
                MEMENUHI SYARAT (LAIK)
              </span>
            ) : (
              <span className="win10-badge win10-badge-warning py-1 px-2.5 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                PERLU PERBAIKAN
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            PUIL 2011/2020 Bagian 6 (Verifikasi)
          </span>
        </div>

      </div>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {INSPECTION_CHECKLIST.map((section, sIdx) => (
          <div key={sIdx} className="win10-card space-y-3">
            <div className="win10-card-header">
              <span>{section.category}</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                {section.items.filter(i => checkedItems[i.id]).length}/{section.items.length} selesai
              </span>
            </div>

            <div className="space-y-2">
              {section.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-3 p-2.5 rounded border cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                    />

                    <div className="flex-1 text-xs leading-relaxed">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                        {item.critical && (
                          <span className="win10-badge win10-badge-warning text-[9px] px-1 py-0">
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
