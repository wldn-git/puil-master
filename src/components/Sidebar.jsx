import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  RotateCw,
  Globe, 
  Palette, 
  BookOpen, 
  ClipboardCheck,
  Library,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const navTabs = [
    { id: 'cable', label: 'Kabel & KHA', icon: Zap },
    { id: 'protection', label: 'Proteksi MCB / RCD', icon: ShieldCheck },
    { id: 'motor', label: 'Sirkit Motor (510.5)', icon: RotateCw },
    { id: 'grounding', label: 'Pembumian (Grounding)', icon: Globe },
    { id: 'guides', label: 'Panduan Visual SNI', icon: Palette },
    { id: 'knowledge', label: 'Kamus Pasal PUIL', icon: BookOpen },
    { id: 'checklist', label: 'Checklist Audit', icon: ClipboardCheck },
    { id: 'glossary', label: 'Glosarium & Referensi', icon: Library },
  ];

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
            <div className="win10-sidebar-title">PUIL App by WLDN</div>
            <span className="win10-badge win10-badge-accent text-[9px] px-1 py-0">SNI 0225:2020</span>
          </div>
        </div>

        {/* Mobile close button only visible on mobile drawer */}
        <button 
          className="win10-sidebar-close-btn"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          title="Tutup Menu"
        >
          <X className="w-4 h-4" />
        </button>
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

      {/* Footer Title */}
      <div className="win10-sidebar-footer">
        <div className="text-[11px] font-semibold text-center tracking-wider text-slate-400 font-mono py-1">
          PUIL App by WLDN
        </div>
      </div>

    </aside>
  );
}
