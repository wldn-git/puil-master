import React from 'react';
import { Menu, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function TopHeader({ activeTab, theme, setTheme, onToggleMobileMenu }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'cable':
        return {
          title: 'Kalkulator KHA Kabel & Penampang Penghantar',
          subtitle: 'Tabel 52-C1 PUIL 2011/2020 & Batas Susut Tegangan (ΔV ≤ 4%)'
        };
      case 'protection':
        return {
          title: 'Proteksi Pemutus Sirkit (MCB & GPAS/RCD)',
          subtitle: 'Karakteristik Kurva B, C, D & Proteksi Manusia 30mA (PUIL 411.3.3)'
        };
      case 'motor':
        return {
          title: 'Kalkulator Sirkit Motor Listrik 3-Fasa',
          subtitle: 'KHA Feeder, Sirkit Akhir, dan Proteksi Arus Lebih (PUIL Gambar 510.5-2 / 5100.5-2)'
        };
      case 'grounding':

        return {
          title: 'Kalkulator Tahanan Pembumian (Grounding)',
          subtitle: 'Perhitungan Elektroda Batang Pasak Tunggal & Paralel (Target ≤ 5 Ω)'
        };
      case 'guides':
        return {
          title: 'Panduan Visual SNI & Standar Praktis',
          subtitle: 'Kode Warna Kabel PUIL 2020 vs 2000, Zonasi Kamar Mandi, dan Kode IP'
        };
      case 'knowledge':
        return {
          title: 'Kamus & Referensi Cepat Pasal PUIL',
          subtitle: 'Direktori Pencarian Instan Aturan Standar SNI 0225:2020 & PUIL 2011'
        };
      case 'checklist':
        return {
          title: 'Checklist Audit Kelaikan Instalasi Listrik',
          subtitle: 'Formulir Inspeksi Mandiri Kepatuhan PUIL & Sertifikat Laik Operasi (SLO)'
        };
      default:
        return {
          title: 'PUIL App by WLDN',
          subtitle: 'Standar Instalasi Listrik SNI'
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <header className="win10-header no-print">
      <div className="win10-header-left">
        {/* Hamburger for mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-slate-300 hover:text-white p-1"
          title="Buka Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="win10-header-title">{title}</div>
          <div className="text-[11px] text-slate-400 hidden sm:block">{subtitle}</div>
        </div>
      </div>

      <div className="win10-header-right">
        {/* Kaidah badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">Ib ≤ In ≤ Iz</span>
        </div>

        {/* Quick Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-secondary text-xs px-2.5 py-1"
          title={theme === 'dark' ? 'Ganti ke Tema Terang (Light Mode)' : 'Ganti ke Tema Gelap (Dark Mode)'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">Gelap</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
