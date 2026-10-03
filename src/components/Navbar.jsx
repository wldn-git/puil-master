import React from 'react';
import { Zap, Printer, Moon, Sun } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, setTheme }) {
  const handlePrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="no-print">
      {/* Native Windows 10 Titlebar */}
      <header className="win10-titlebar">
        <div className="win10-titlebar-left">
          <div className="win10-app-icon">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <span>PUIL Master — Persyaratan Umum Instalasi Listrik [SNI 0225:2020 & PUIL 2011]</span>
        </div>

        <div className="win10-window-controls">
          <button
            onClick={toggleTheme}
            className="win10-btn-control"
            title={theme === 'dark' ? 'Ganti ke Windows 10 Mode Terang' : 'Ganti ke Windows 10 Mode Gelap'}
            style={{ width: '36px' }}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handlePrint}
            className="win10-btn-control"
            title="Cetak Laporan / Simpan PDF"
            style={{ width: '36px' }}
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://github.com/wldn-git/puil-master"
            target="_blank"
            rel="noopener noreferrer"
            className="win10-btn-control"
            title="Buka GitHub Repository"
            style={{ width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Real Windows 10 Titlebar Window Buttons */}
          <button className="win10-btn-control" title="Minimize" onClick={() => alert('Jendela diminimalkan.')}>
            &#x2015;
          </button>
          <button className="win10-btn-control" title="Maximize" onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}>
            &#x25A1;
          </button>
          <button className="win10-btn-control btn-close" title="Close" onClick={() => window.close()}>
            &#x2715;
          </button>
        </div>
      </header>
    </div>
  );
}
