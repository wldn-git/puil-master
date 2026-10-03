import React, { useState, useMemo } from 'react';
import { PUIL_ARTICLES } from '../data/puilData';
import { 
  Search, 
  BookOpen, 
  Tag, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  FileText 
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
    <div className="space-y-6">

      {/* Intro Header */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Kamus & Referensi Cepat Pasal PUIL</h2>
            </div>
            <p className="text-sm text-slate-400">
              Direktori praktis aturan kunci PUIL 2011 dan SNI 0225:2020 yang paling sering dirujuk teknisi.
            </p>
          </div>
          <span className="badge badge-cyan font-mono">
            {filteredArticles.length} Aturan Ditemukan
          </span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="glass-panel p-5 border-slate-800 space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pasal, kata kunci (contoh: tinggi saklar, 1.5 mm², megger, RCD, grounding)..."
            className="custom-input pl-11 py-2.5 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Topik' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="glass-panel p-12 text-center border-slate-800">
            <p className="text-slate-400 text-sm">Tidak ada aturan yang cocok dengan kata kunci "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="mt-3 text-xs text-amber-400 underline font-semibold"
            >
              Reset filter pencarian
            </button>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div 
              key={art.id} 
              className="glass-panel p-5 border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning text-[10px] font-mono">
                    {art.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Rujukan: <strong className="text-slate-200">{art.pasal}</strong>
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white">
                {art.title}
              </h3>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs text-amber-200/90 font-medium leading-relaxed">
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
