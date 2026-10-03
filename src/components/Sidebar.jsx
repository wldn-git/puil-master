import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Palette, 
  BookOpen, 
  ClipboardCheck,
  Sun,
  Moon,
  Printer,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, theme, setTheme, isMobileOpen, setIsMobileOpen }) {
  const navTabs = [
    { id: 'cable', label: 'Kabel & KHA', icon: Zap },
    { id: 'protection', label: 'Proteksi MCB / RCD', icon: ShieldCheck },
    { id: 'grounding', label: 'Pembumian (Grounding)', icon: Globe },
    { id: 'guides', label: 'Panduan Visual SNI', icon: Palette },
    { id: 'knowledge', label: 'Kamus Pasal PUIL', icon: BookOpen },
    { id: 'checklist', label: 'Checklist Audit', icon: ClipboardCheck },
  ];

  const handlePrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <aside className={`win10-sidebar no-print ${isMobileOpen ? 'open' : ''}`}>
      
      {/* Brand Header */}
      <div className="win10-sidebar-brand justify-between">
        <div className="flex items-center gap-2.5">
          <div className="win10-sidebar-logo">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <div className="win10-sidebar-title">PUIL Master</div>
            <span className="badge badge-cyan text-[9px] px-1 py-0">SNI 0225:2020</span>
          </div>
        </div>

        {/* Mobile close button */}
        {setIsMobileOpen && (
          <button 
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="win10-sidebar-nav">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`win10-nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls: Theme Toggle, Print, GitHub */}
      <div className="win10-sidebar-footer">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="win10-sidebar-action-btn"
          title="Beralih Mode Tampilan"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-sky-500" />
            )}
            <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="win10-sidebar-action-btn"
          title="Cetak Laporan / Simpan PDF"
        >
          <div className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Cetak / PDF</span>
          </div>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/wldn-git/puil-master"
          target="_blank"
          rel="noopener noreferrer"
          className="win10-sidebar-action-btn"
          title="Buka GitHub Repository"
        >
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </div>
          <span className="text-[10px] text-slate-400">wldn-git</span>
        </a>

        {/* Small version footnote */}
        <div className="text-[10px] text-slate-500 text-center pt-1 font-mono">
          PUIL Master v1.0 • Win 10 UI
        </div>

      </div>

    </aside>
  );
}
