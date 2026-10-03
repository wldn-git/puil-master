import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CableCalculator from './components/CableCalculator';
import ProtectionCalculator from './components/ProtectionCalculator';
import GroundingCalculator from './components/GroundingCalculator';
import VisualGuides from './components/VisualGuides';
import PuilKnowledgeBase from './components/PuilKnowledgeBase';
import InstallationChecklist from './components/InstallationChecklist';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Palette, 
  BookOpen, 
  ClipboardCheck,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('cable');

  const navTabs = [
    { id: 'cable', label: 'Kabel & KHA', icon: Zap, desc: 'Penampang & Susut Tegangan' },
    { id: 'protection', label: 'Proteksi MCB / RCD', icon: ShieldCheck, desc: 'Kurva & Sensitivitas' },
    { id: 'grounding', label: 'Pembumian', icon: Globe, desc: 'Target ≤ 5 Ohm' },
    { id: 'guides', label: 'Panduan Visual', icon: Palette, desc: 'Warna SNI & Kamar Mandi' },
    { id: 'knowledge', label: 'Referensi Pasal', icon: BookOpen, desc: 'Kamus Cepat PUIL' },
    { id: 'checklist', label: 'Checklist Audit', icon: ClipboardCheck, desc: 'Inspeksi & Uji Laik' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="no-print glass-panel p-2 border-slate-800/80 overflow-x-auto">
          <nav className="flex items-center gap-1.5 min-w-max">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Tab Views */}
        <div className="transition-opacity duration-200">
          {activeTab === 'cable' && <CableCalculator />}
          {activeTab === 'protection' && <ProtectionCalculator />}
          {activeTab === 'grounding' && <GroundingCalculator />}
          {activeTab === 'guides' && <VisualGuides />}
          {activeTab === 'knowledge' && <PuilKnowledgeBase />}
          {activeTab === 'checklist' && <InstallationChecklist />}
        </div>

      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Referensi: <strong>SNI 0225:2020 (PUIL 2020)</strong> & <strong>PUIL 2011</strong> (BSN / Dirjen Ketenagalistrikan ESDM)</span>
          </div>
          <p className="text-slate-500">
            Dibuat untuk memudahkan teknisi, mahasiswa teknik elektro, dan instalatur listrik di Indonesia.
          </p>
        </div>
      </footer>

    </div>
  );
}
