import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  Newspaper, 
  OctagonAlert, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Globe
} from 'lucide-react';

function App() {
  // --- STATE MANAGEMENT ---
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Configuration
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const categories = ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];

  // --- API FETCH LOGIC ---
  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = query 
        ? `https://gnews.io/api/v4/search?q=${query}&page=${page}&max=12&lang=en&apikey=${API_KEY}`
        : `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=12&apikey=${API_KEY}`;
      
      const response = await axios.get(url);
      setArticles(response.data.articles || []);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    fetchNews();
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- PROFESSIONAL DOUBLE-DECKER NAVBAR --- */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* TOP DECK: Brand & Search */}
          <div className="flex items-center justify-between h-20 gap-8">
            
            {/* UPGRADED LOGO CONTAINER */}
            <div 
              className="relative group cursor-pointer flex items-center gap-3"
              onClick={() => {setQuery(''); setCategory('general'); setPage(1);}}
            >
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100 group-hover:shadow-blue-300 group-hover:-rotate-3 group-hover:scale-105 transition-all duration-300">
                <Newspaper size={24} strokeWidth={2.5} />
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-xl font-black tracking-tighter leading-none text-slate-900 uppercase">
                  Daily<span className="text-blue-600">Pulse</span>
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1.5">
                  By Abdalsalam
                </span>
              </div>
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative group">
              <input 
                type="text" 
                placeholder="Search global stories..." 
                className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-2.5 pl-11 pr-4 focus:ring-0 focus:border-blue-500/30 focus:bg-white transition-all text-sm outline-none shadow-inner"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            </form>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* BOTTOM DECK: Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-2 h-12 border-t border-slate-100/60">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => {setCategory(cat); setQuery(''); setPage(1);}}
                className={`px-4 h-full text-[11px] font-bold uppercase tracking-widest transition-all relative group
                  ${category === cat && !query ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {cat}
                {category === cat && !query ? (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]" />
                ) : (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-slate-300 rounded-t-full group-hover:left-4 group-hover:right-4 group-hover:w-auto transition-all duration-300" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* --- COMPACT MOBILE DRAWER --- */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-2 duration-300 max-h-[75vh] overflow-y-auto">
            <div className="p-4 space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 text-sm outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </form>
              <div className="grid grid-cols-2 gap-2 pb-4">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => {setCategory(cat); setQuery(''); setPage(1); setIsMenuOpen(false);}}
                    className={`px-3 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all border
                      ${category === cat && !query ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-slate-600 border-slate-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* --- MAIN FEED --- */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl p-4 h-[400px]">
                <div className="bg-slate-200 w-full h-48 rounded-2xl mb-4" />
                <div className="bg-slate-200 w-3/4 h-6 rounded-md mb-2" />
                <div className="bg-slate-200 w-full h-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {articles.map((article, index) => (
              <article key={index} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={article.title}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter text-blue-600 shadow-sm">
                    {article.source.name}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-4 uppercase tracking-widest">
                    <Calendar size={14} className="text-blue-500" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed">
                    {article.description}
                  </p>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-blue-600 hover:shadow-lg transition-all shadow-md"
                  >
                    READ ARTICLE <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
            <OctagonAlert className="mx-auto text-slate-200 mb-6" size={80} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
            <button onClick={() => {setQuery(''); setCategory('general'); setPage(1);}}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Reset Filters
            </button>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {articles.length > 0 && (
          <div className="mt-20 flex items-center justify-center gap-4">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}
              className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-900 shadow-sm">
              <ChevronLeft size={24} />
            </button>
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-900 shadow-sm">
              Page {page}
            </div>
            <button onClick={() => setPage(page + 1)} className="p-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all text-slate-900 shadow-sm">
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 py-12 bg-white text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Globe className="text-blue-600" size={22} />
          <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900">
            DailyPulse <span className="text-slate-400 font-light mr-1">by</span> Abdalsalam
          </span>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          © 2026 | Powered by GNews API
        </p>
      </footer>

    </div>
  );
}

export default App;