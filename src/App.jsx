import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import CableCalculator from './components/CableCalculator';
import ProtectionCalculator from './components/ProtectionCalculator';
import MotorCircuitCalculator from './components/MotorCircuitCalculator';
import GroundingCalculator from './components/GroundingCalculator';
import VisualGuides from './components/VisualGuides';
import PuilKnowledgeBase from './components/PuilKnowledgeBase';
import InstallationChecklist from './components/InstallationChecklist';

export default function App() {
  const [activeTab, setActiveTab] = useState('motor'); // Default to motor tab to immediately showcase the new calculator!
  const [theme, setTheme] = useState('dark');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="win10-app-layout">
      
      {/* Windows 10 Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        setTheme={setTheme}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Right Pane */}
      <div className="win10-main-pane">
        
        {/* Top Header (No Close/Minimize buttons!) */}
        <TopHeader 
          activeTab={activeTab} 
          theme={theme} 
          setTheme={setTheme}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Content Body */}
        <main className="win10-content-body">
          <div className="transition-opacity duration-150">
            {activeTab === 'cable' && <CableCalculator />}
            {activeTab === 'protection' && <ProtectionCalculator />}
            {activeTab === 'motor' && <MotorCircuitCalculator />}
            {activeTab === 'grounding' && <GroundingCalculator />}
            {activeTab === 'guides' && <VisualGuides />}
            {activeTab === 'knowledge' && <PuilKnowledgeBase />}
            {activeTab === 'checklist' && <InstallationChecklist />}
          </div>
        </main>


        {/* Windows 10 Status Bar */}
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

    </div>
  );
}
