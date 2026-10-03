import React, { useState, useMemo } from 'react';
import { PUIL_ARTICLES } from '../data/puilData';
import { 
  Search, 
  BookOpen, 
  Tag, 
  CheckCircle2, 
  FileText,
  X
} from 'lucide-react';

export default function PuilKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set(PUIL_ARTICLES.map(a => a.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return PUIL_ARTICLES.filter(article => {
      const matchCat = selectedCategory === 'ALL' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchQuery = !searchQuery || 
        article.title.toLowerCase().includes(q) ||
        article.pasal.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.detail.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-4">

      {/* Intro Header */}
      <div className="win10-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <h2 className="text-base font-bold text-white">Kamus & Referensi Cepat Pasal PUIL</h2>
            </div>
            <p className="text-xs text-slate-400">
              Direktori praktis aturan kunci PUIL 2011 dan SNI 0225:2020 yang paling sering dirujuk teknisi.
            </p>
          </div>
          <div className="flex items-center">
            <span className="win10-badge win10-badge-accent font-mono">
              {filteredArticles.length} Aturan Ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="win10-card space-y-3">
        
        {/* Search Bar Container */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pasal, kata kunci (contoh: tinggi saklar, 1.5 mm², megger, RCD, grounding)..."
            className="win10-input"
            style={{ paddingLeft: '36px', paddingRight: '60px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`win10-btn ${
                selectedCategory === cat ? 'win10-btn-primary' : ''
              }`}
            >
              {cat === 'ALL' ? 'Semua Topik' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="win10-card p-8 text-center">
            <p className="text-slate-400 text-xs">Tidak ada aturan yang cocok dengan kata kunci "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="mt-2 text-xs text-sky-400 underline font-semibold cursor-pointer"
            >
              Reset filter pencarian
            </button>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div key={art.id} className="win10-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="win10-badge win10-badge-warning">
                  {art.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Rujukan: <strong className="text-white">{art.pasal}</strong>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white pt-1">
                {art.title}
              </h3>

              <div className="win10-callout">
                📌 <strong>Ringkasan Syarat:</strong> {art.summary}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {art.detail}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
