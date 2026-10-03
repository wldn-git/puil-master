import React, { useState } from 'react';
import { 
  WIRE_COLOR_COMPARISON, 
  BATHROOM_ZONES 
} from '../data/puilData';
import { 
  Palette, 
  Droplets, 
  Shield, 
  Eye, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function VisualGuides() {
  const [subTab, setSubTab] = useState('colors'); // 'colors', 'zones', 'ip'
  const [standardView, setStandardView] = useState('current'); // 'current' (2011/2020) or 'old' (2000)
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);

  return (
    <div className="space-y-6">

      {/* Intro Header */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Palette className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Panduan Visual & Referensi Praktis PUIL</h2>
            </div>
            <p className="text-sm text-slate-400">
              Standar kode warna penghantar SNI, zonasi keamanan area basah (kamar mandi), dan kode proteksi IP.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSubTab('colors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                subTab === 'colors'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🎨 Warna Kabel SNI
            </button>
            <button
              onClick={() => setSubTab('zones')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                subTab === 'zones'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🚿 Zonasi Kamar Mandi
            </button>
            <button
              onClick={() => setSubTab('ip')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                subTab === 'ip'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🛡️ Kode Proteksi IP
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: CABLE COLOR CODE */}
      {subTab === 'colors' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Standar Kode Warna Penghantar PUIL</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bandingkan standar modern (PUIL 2011/2020 / SNI IEC 60446) dengan standar lama (PUIL 2000).
                </p>
              </div>

              {/* Toggle Current vs Old */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setStandardView('current')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    standardView === 'current'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Standar Baru (PUIL 2011 & 2020)
                </button>
                <button
                  onClick={() => setStandardView('old')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    standardView === 'old'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Standar Lama (PUIL 2000)
                </button>
              </div>
            </div>

            {/* Wire Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
              {WIRE_COLOR_COMPARISON.map((wire, idx) => {
                const item = standardView === 'current' ? wire.current : wire.old;
                const isStriped = !!item.stripe;

                return (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Wire Visual Graphic */}
                      <div className="w-full h-14 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden border border-slate-700/50 shadow-inner">
                        {isStriped ? (
                          <div 
                            className="w-full h-full"
                            style={{
                              background: `repeating-linear-gradient(45deg, ${item.hex}, ${item.hex} 10px, ${item.stripe} 10px, ${item.stripe} 20px)`
                            }}
                          ></div>
                        ) : (
                          <div 
                            className="w-full h-full" 
                            style={{ backgroundColor: item.hex }}
                          ></div>
                        )}
                        <span className="absolute px-2 py-0.5 rounded text-[11px] font-black bg-slate-950/80 text-white border border-white/20 font-mono">
                          {wire.phase.split(' ')[0]} {wire.phase.split(' ')[1]}
                        </span>
                      </div>

                      <div className="font-bold text-sm text-white">{wire.phase}</div>
                      <div className="text-xs font-bold text-amber-400 mt-0.5">{item.name}</div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                      {wire.notes}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Crucial Safety Notice */}
            <div className="mt-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong>Peringatan Renovasi & Pekerjaan Lapangan:</strong> Banyak bangunan lama di Indonesia masih memakai standar PUIL 2000 (Fasa R = Merah, Fasa S = Kuning, Fasa T = Hitam). Jangan berasumsi sebelum mengecek dengan multimeter / tespen bertegangan!
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: BATHROOM ZONING */}
      {subTab === 'zones' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 border-slate-800">
            <h3 className="text-base font-bold text-white mb-1">
              Zonasi Keselamatan Listrik Kamar Mandi (PUIL Bagian 701)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Resistansi tubuh manusia turun hingga 10% saat basah kuyup. Klik zona di bawah untuk melihat batas peralatan & proteksi.
            </p>

            {/* Zone Selector Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {BATHROOM_ZONES.map((z, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedZoneIndex(idx)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    selectedZoneIndex === idx
                      ? 'bg-sky-500/20 border-sky-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wider mb-1 text-sky-400 font-mono">
                    {z.zone}
                  </div>
                  <div className="text-xs font-semibold line-clamp-1">{z.title}</div>
                </button>
              ))}
            </div>

            {/* Active Zone Detail Card */}
            {(() => {
              const activeZone = BATHROOM_ZONES[selectedZoneIndex];
              return (
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-sky-400 font-mono uppercase">{activeZone.zone}</span>
                      <h4 className="text-lg font-bold text-white mt-0.5">{activeZone.title}</h4>
                    </div>
                    <span className="badge badge-warning font-mono">
                      Proteksi: {activeZone.ipRating}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeZone.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/20">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Peralatan & Tegangan yang Diizinkan:
                      </span>
                      <p className="text-xs text-slate-300">{activeZone.voltage}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/20">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1.5">
                        <Lock className="w-4 h-4" />
                        Larangan Keras PUIL:
                      </span>
                      <p className="text-xs text-slate-300">{activeZone.prohibited}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* SUB-TAB 3: IP CODE MATRIX */}
      {subTab === 'ip' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Kode Proteksi Ingress (IP Code - SNI IEC 60529)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Format: <strong>IP [Angka 1: Debu/Benda Padat] [Angka 2: Air/Kelembapan]</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-white font-mono">IP20</span>
                  <span className="badge badge-cyan text-[10px]">Standar Indoor</span>
                </div>
                <p className="text-xs text-slate-300">
                  Terlindung dari jari tangan (&gt;12,5 mm). <strong>TIDAK ADA proteksi air sama sekali.</strong>
                </p>
                <span className="text-[11px] text-slate-500 block">Penerapan: Kamar tidur, ruang tamu, panel tertutup kering.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-amber-400 font-mono">IP44</span>
                  <span className="badge badge-warning text-[10px]">Percikan Air</span>
                </div>
                <p className="text-xs text-slate-300">
                  Terlindung dari benda &gt;1 mm (kawat kecil) dan <strong>cipratan air dari segala arah</strong>.
                </p>
                <span className="text-[11px] text-slate-500 block">Penerapan: Kamar mandi Zona 2, teras beratap, area dekat wastafel.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-sky-400 font-mono">IP65</span>
                  <span className="badge badge-cyan text-[10px]">Semprotan Air</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Kedap debu total</strong> dan tahan semprotan air bertekanan rendah dari nozzle.
                </p>
                <span className="text-[11px] text-slate-500 block">Penerapan: Lampu sorot taman, stop kontak outdoor luar ruangan.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-emerald-400 font-mono">IP67</span>
                  <span className="badge badge-success text-[10px]">Perendaman Sementara</span>
                </div>
                <p className="text-xs text-slate-300">
                  Kedap debu & <strong>tahan perendaman sementara dalam air</strong> hingga kedalaman 1 meter selama 30 menit.
                </p>
                <span className="text-[11px] text-slate-500 block">Penerapan: Lampu taman tertanam di tanah, dekat parit saluran air.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-emerald-400 font-mono">IP68</span>
                  <span className="badge badge-success text-[10px]">Perendaman Terus-menerus</span>
                </div>
                <p className="text-xs text-slate-300">
                  Kedap debu total & <strong>tahan perendaman terus-menerus</strong> dalam air bertekanan.
                </p>
                <span className="text-[11px] text-slate-500 block">Penerapan: Pompa submersible, lampu underwater kolam renang / air mancur.</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
