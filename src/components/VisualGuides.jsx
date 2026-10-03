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
  Lock
} from 'lucide-react';

export default function VisualGuides() {
  const [subTab, setSubTab] = useState('colors'); // 'colors', 'zones', 'ip'
  const [standardView, setStandardView] = useState('current'); // 'current' (2011/2020) or 'old' (2000)
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);

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
            <button
              onClick={() => setSubTab('ip')}
              className={`win10-btn ${subTab === 'ip' ? 'win10-btn-primary' : ''}`}
            >
              🛡️ Kode Proteksi IP
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: CABLE COLOR CODE */}
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

      {/* SUB-TAB 2: BATHROOM ZONING */}
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

      {/* SUB-TAB 3: IP CODE MATRIX */}
      {subTab === 'ip' && (
        <div className="win10-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Kode Proteksi Ingress (IP Code - SNI IEC 60529)</h3>
            <p className="text-xs text-slate-400">
              Format: <strong>IP [Angka 1: Debu/Benda Padat 0-6] [Angka 2: Air/Kelembapan 0-9K]</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            
            <div className="win10-card p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">IP20</span>
                <span className="win10-badge win10-badge-accent">Standar Indoor</span>
              </div>
              <p className="text-xs text-slate-300">
                Terlindung dari jari tangan (&gt;12,5 mm). <strong>TIDAK ADA proteksi air sama sekali.</strong>
              </p>
              <span className="text-[11px] text-slate-400 block">Penerapan: Kamar tidur, ruang tamu, panel tertutup.</span>
            </div>

            <div className="win10-card p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-400 font-mono">IP44</span>
                <span className="win10-badge win10-badge-warning">Percikan Air</span>
              </div>
              <p className="text-xs text-slate-300">
                Terlindung dari benda &gt;1 mm dan <strong>cipratan air dari segala arah</strong>.
              </p>
              <span className="text-[11px] text-slate-400 block">Penerapan: Kamar mandi Zona 2, teras beratap, area dekat wastafel.</span>
            </div>

            <div className="win10-card p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-sky-400 font-mono">IP65</span>
                <span className="win10-badge win10-badge-accent">Semprotan Air</span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Kedap debu total</strong> dan tahan semprotan air bertekanan rendah dari nozzle.
              </p>
              <span className="text-[11px] text-slate-400 block">Penerapan: Lampu sorot taman, stop kontak outdoor luar ruangan.</span>
            </div>

            <div className="win10-card p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400 font-mono">IP67</span>
                <span className="win10-badge win10-badge-success">Perendaman Sementara</span>
              </div>
              <p className="text-xs text-slate-300">
                Kedap debu & <strong>tahan perendaman sementara dalam air</strong> hingga 1 meter (30 menit).
              </p>
              <span className="text-[11px] text-slate-400 block">Penerapan: Lampu taman tertanam, saluran parit air.</span>
            </div>

            <div className="win10-card p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400 font-mono">IP68</span>
                <span className="win10-badge win10-badge-success">Perendaman Kontinu</span>
              </div>
              <p className="text-xs text-slate-300">
                Kedap debu total & <strong>tahan perendaman terus-menerus</strong> dalam air bertekanan.
              </p>
              <span className="text-[11px] text-slate-400 block">Penerapan: Pompa celup (submersible), lampu underwater kolam renang.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
