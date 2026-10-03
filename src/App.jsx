import React, { useState, useEffect } from 'react';
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
  ClipboardCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('cable');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navTabs = [
    { id: 'cable', label: 'Kabel & KHA', icon: Zap },
    { id: 'protection', label: 'Proteksi MCB / RCD', icon: ShieldCheck },
    { id: 'grounding', label: 'Pembumian (Grounding)', icon: Globe },
    { id: 'guides', label: 'Panduan Visual SNI', icon: Palette },
    { id: 'knowledge', label: 'Kamus Pasal PUIL', icon: BookOpen },
    { id: 'checklist', label: 'Checklist Audit', icon: ClipboardCheck },
  ];

  return (
    <div className="win10-window">
      
      {/* Windows 10 Titlebar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        setTheme={setTheme} 
      />

      {/* Windows 10 Ribbon / Tab Navigation */}
      <div className="win10-menubar no-print">
        <nav className="win10-tabs-nav">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`win10-tab-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Workspace Area */}
      <main className="win10-content">
        <div className="transition-opacity duration-150">
          {activeTab === 'cable' && <CableCalculator />}
          {activeTab === 'protection' && <ProtectionCalculator />}
          {activeTab === 'grounding' && <GroundingCalculator />}
          {activeTab === 'guides' && <VisualGuides />}
          {activeTab === 'knowledge' && <PuilKnowledgeBase />}
          {activeTab === 'checklist' && <InstallationChecklist />}
        </div>
      </main>

      {/* Native Windows 10 Status Bar */}
      <footer className="win10-statusbar no-print">
        <div className="flex items-center">
          <span className="win10-statusbar-item">Ready</span>
          <span className="win10-statusbar-item">Standar: SNI 0225:2020 & PUIL 2011</span>
          <span className="win10-statusbar-item">Kaidah: Ib ≤ In ≤ Iz</span>
        </div>
        <div className="flex items-center">
          <span className="win10-statusbar-item">Cu / PVC</span>
          <span className="win10-statusbar-item">UTF-8</span>
          <span className="win10-statusbar-item">100%</span>
        </div>
      </footer>

    </div>
  );
}
